<template>
  <div class="main-box">
    <ProTree
      ref="proTree"
      :requestApi="getFootprintCategoryEnumTree"
      :initParam="initParamCategory"
      :dataCallback="dataCallbackTree"
      @handle-node-click="handleCategorySelect"
    >
      <template #treeHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openFootprintCategoryDrawer('New')" v-if="BUTTONS.add"></el-button>
        <el-button
          :icon="EditPen"
          :disabled="scope.row.id === ''"
          @click="openFootprintCategoryDrawer('Edit', scope.row)"
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
        ref="proTable"
        :columns="columns"
        :requestApi="getFootprintList"
        :initParam="initParam"
        :isPageable="true"
        :dataCallback="dataCallbackTable"
      >
        <!-- Table header button -->
        <template #tableHeader="scope">
          <el-button type="primary" :icon="CirclePlus" @click="openFootprintDrawer('New')" v-if="BUTTONS.add">
            New Footprint
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
        <template #action="scope">
          <el-button type="primary" link :icon="EditPen" @click="openFootprintDrawer('Edit', scope.row)">Edit</el-button>
        </template>
      </ProTable>
      <FootprintDrawer ref="drawerRefFootprint"></FootprintDrawer>
      <FootprintCategoryDrawer ref="drawerRefFootprintCategory"></FootprintCategoryDrawer>
    </div>
  </div>
</template>

<script setup lang="tsx" name="useComponent">
import { ref, reactive, nextTick } from "vue";
import { ColumnProps } from "@/components/ProTable/interface/index";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import ProTree from "@/components/ProTree/index.vue";
import FootprintDrawer from "@/views/footprints/components/FootprintDrawer.vue";
import FootprintCategoryDrawer from "@/views/footprints/components/FootprintCategoryDrawer.vue";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
import { ResList, Footprint, FootprintCategory } from "@/api/interface";
import {
  getFootprintList,
  postFootprintCreate,
  patchFootprintUpdate,
  deleteFootprints,
  getFootprintCategoryEnum,
  getFootprintCategoryEnumTree,
  postFootprintCategoryCreate,
  patchFootprintCategoryUpdate,
  deleteFootprintCategories
} from "@/api/modules/components";

// Get the ProTable element and call it to get the refresh data method (you can also get the current query parameter, so that it is convenient for exporting and carrying parameters)
const proTable = ref();
const proTree = ref();

// If the table needs to initialize the request parameter, it will be directly defined to the propable (each request will automatically bring the parameter every time, and it will always be brought to
const initParam = reactive<Partial<Footprint.ReqGetFootprintListParams>>({
  expand: "category"
  // filter: { name: undefined, category: undefined, description: undefined }
});

const initParamCategory = reactive({});

// DataCallBack is processed to the returned table data. If the data returned in the background is not DataList && Total && PAGENUM && PageSize, then you can process these fields here.
const dataCallbackTree = (data: any) => {
  return data;
};
const dataCallbackTable = (data: ResList<Footprint.ResGetFootprintRecord>) => {
  return {
    datalist: data.items,
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
    width: 130,
    sortable: true,
    search: { el: "input" }
  },
  {
    prop: "category",
    label: "Category",
    width: 120,
    // enum: getFootprintCategoryEnumTree,
    enum: async () => {
      // nextTick to prevent calling api multiple times and per instant and race condition on loading screen tracker
      await nextTick();
      return await getFootprintCategoryEnum();
    },
    fieldNames: { value: "id", label: "_fullName" },
    sortable: true,
    // search: {
    //   el: "tree-select",
    //   props: {
    //     props: { value: "id", label: "name" }
    //   }
    // },
    isShow: false
  },
  {
    prop: "description",
    label: "Description",
    // width: 220,
    search: { el: "input" }
  },
  {
    prop: "action",
    label: "Action",
    width: 100,
    fixed: "right"
  }
];

// Batch delete footprints
const batchDelete = async (ids: string[]) => {
  await useHandleData(deleteFootprints, { ids }, "Delete the selected footprints(s)");
  proTable.value.refresh();
};

// Batch delete footprints
const batchDeleteCategory = async (ids: string[]) => {
  await useHandleData(deleteFootprintCategories, { ids }, "Delete the selected footprint categories(s)");
  proTree.value.refresh();
};

// Open the drawer (new, view, edit)
interface DrawerExpose {
  acceptParams: (params: any) => void;
}
const drawerRefFootprint = ref<DrawerExpose>();
const openFootprintDrawer = (title: string, rowData: Partial<Footprint.ResGetFootprintRecord> = {}) => {
  let params = {
    title,
    rowData: { ...rowData },
    isView: title === "View",
    apiUrl: title === "New" ? postFootprintCreate : title === "Edit" ? patchFootprintUpdate : "",
    updateTable: proTable.value.refresh
  };
  drawerRefFootprint.value!.acceptParams(params);
};

const drawerRefFootprintCategory = ref<DrawerExpose>();
const openFootprintCategoryDrawer = (title: string, rowData: Partial<FootprintCategory.ResGetFootprintCategoryRecord> = {}) => {
  let params = {
    title,
    rowData: { ...rowData },
    isView: title === "View",
    apiUrl: title === "New" ? postFootprintCategoryCreate : title === "Edit" ? patchFootprintCategoryUpdate : "",
    updateTable: proTree.value.refresh
  };
  drawerRefFootprintCategory.value!.acceptParams(params);
};
</script>
