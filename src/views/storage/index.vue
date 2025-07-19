<template>
  <div class="main-box">
    <ProTree
      ref="proTree"
      :requestApi="getStorageCategoryEnumTree"
      :initParam="initParamCategory"
      :dataCallback="dataCallbackTree"
      @handle-node-click="handleCategorySelect"
    >
      <template #treeHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openStorageCategoryDrawer('New')" v-if="BUTTONS.add"></el-button>
        <el-button
          :icon="EditPen"
          :disabled="scope.row.id === ''"
          @click="openStorageCategoryDrawer('Edit', scope.row as unknown as StorageCategory.ResGetStorageCategoryRecord)"
          v-if="BUTTONS.edit"
        ></el-button>
        <el-button
          type="danger"
          :icon="Delete"
          plain
          :disabled="scope.row.id === ''"
          @click="batchDeleteCategory([scope.row.id])"
          v-if="BUTTONS.delete"
        >
        </el-button>
      </template>
    </ProTree>
    <div class="table-box">
      <ProTable
        pageAuthId="storage"
        ref="proTable"
        :columns="columns"
        :requestApi="getStorageList"
        :initParam="initParam"
        :isPageable="true"
        :dataCallback="dataCallbackTable"
      >
        <!-- Table header button -->
        <template #tableHeader="scope">
          <el-button type="primary" :icon="CirclePlus" @click="openStorageDrawer('New')" v-if="BUTTONS.add">
            New Storage
          </el-button>
          <el-button
            type="danger"
            :icon="Delete"
            plain
            :disabled="!scope.isSelected"
            @click="batchDelete(scope.selectedListIds)"
            v-if="BUTTONS.delete"
          >
            Delete
          </el-button>
        </template>
        <!-- Expand -->
        <template #expand="scope">
          {{ scope.row }}
        </template>
        <!-- Table operation -->
        <template #operation="scope">
          <el-button type="primary" link :icon="EditPen" @click="openStorageDrawer('Edit', scope.row)">Edit</el-button>
        </template>
      </ProTable>
      <StorageDrawer ref="drawerRefStorage"></StorageDrawer>
      <StorageCategoryDrawer ref="drawerRefStorageCategory"></StorageCategoryDrawer>
    </div>
  </div>
</template>

<script setup lang="tsx" name="storage">
import { ref, reactive, nextTick } from "vue";
import { ColumnProps, PageableList } from "@/components/ProTable/interface/index";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import ProTree from "@/components/ProTree/index.vue";
import StorageDrawer from "@/views/storage/components/StorageDrawer.vue";
import StorageCategoryDrawer from "@/views/storage/components/StorageCategoryDrawer.vue";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
import { ListResult, Storage, StorageCategory } from "@/api/interface";
import {
  getStorageList,
  postStorageCreate,
  patchStorageUpdate,
  deleteStorages,
  getStorageCategoryEnum,
  getStorageCategoryEnumTree,
  postStorageCategoryCreate,
  patchStorageCategoryUpdate,
  deleteStorageCategories
} from "@/api/modules/components";

// Get the ProTable element and call it to get the refresh data method (you can also get the current query parameter, so that it is convenient for exporting and carrying parameters)
const proTable = ref();
const proTree = ref();

// If the table needs to initialize the request parameter, it will be directly defined to the propable (each request will automatically bring the parameter every time, and it will always be brought to
const initParam = reactive<Partial<Storage.ReqGetStorageListParams>>({
  expand: "category"
});

const initParamCategory = reactive({});

// DataCallBack is processed to the returned table data. If the data returned in the background is not DataList && Total && PAGENUM && PageSize, then you can process these fields here.
const dataCallbackTree = (data: any) => {
  return data;
};
const dataCallbackTable = (data: ListResult<Storage.ResGetStorageRecord>): PageableList<Storage.ResGetStorageRecord> => {
  return {
    list: data.items,
    total: data.totalItems,
    pageNum: data.page,
    pageSize: data.perPage
  };
};

// what binds the category tree to the table filter
const handleCategorySelect = (data: any) => {
  if (typeof initParam.filter === "undefined") {
    Object.assign(initParam, { filter: { category: "" } });
  }
  Object.assign(initParam.filter!, { category: data.id });
};

// Page button permission
const { BUTTONS } = useAuthButtons();

// Table configuration item
const columns: ColumnProps[] = [
  { type: "selection", width: 40, fixed: "left" },
  // { type: "expand", label: "" },
  {
    prop: "name",
    label: "Name",
    width: 200,
    sortable: true,
    search: { el: "input" }
  },
  {
    prop: "category",
    label: "Category",
    width: 200,
    sortable: true,
    enum: async () => {
      // nextTick to prevent calling api multiple times and per instant and race condition on loading screen tracker
      await nextTick();
      return await getStorageCategoryEnum();
    },
    fieldNames: { value: "id", label: "_fullName" },
    isShow: false
  },
  {
    prop: "description",
    label: "Description",
    // width: 220,
    search: { el: "input" }
  },
  {
    prop: "operation",
    label: "Operation",
    width: 100,
    fixed: "right"
  }
];

// Batch delete footprints
const batchDelete = async (ids: string[]) => {
  await useHandleData(deleteStorages, { ids }, "Delete the selected footprints(s)");
  proTable.value.getTableList();
};

// Batch delete footprints
const batchDeleteCategory = async (ids: string[]) => {
  await useHandleData(deleteStorageCategories, { ids }, "Delete the selected footprint categories(s)");
  proTree.value.refresh();
};

// Open the drawer (new, view, edit)
const drawerRefStorage = ref<InstanceType<typeof StorageDrawer>>();
const openStorageDrawer = (title: string, rowData?: Storage.ResGetStorageRecord) => {
  let params = {
    title,
    rowData: rowData || ({} as Storage.ResGetStorageRecord),
    isView: title === "View",
    apiUrl: title === "New" ? postStorageCreate : title === "Edit" ? patchStorageUpdate : undefined,
    updateTable: proTable.value.getTableList
  };
  drawerRefStorage.value!.acceptParams(params);
};

const drawerRefStorageCategory = ref<InstanceType<typeof StorageCategoryDrawer>>();
const openStorageCategoryDrawer = (title: string, rowData?: StorageCategory.ResGetStorageCategoryRecord) => {
  let params = {
    title,
    rowData: rowData || ({} as StorageCategory.ResGetStorageCategoryRecord),
    isView: title === "View",
    apiUrl: title === "New" ? postStorageCategoryCreate : title === "Edit" ? patchStorageCategoryUpdate : undefined,
    updateTable: proTree.value.refresh
  };
  drawerRefStorageCategory.value!.acceptParams(params);
};
</script>
