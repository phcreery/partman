<template>
  <div class="main-box">
    <ProTree
      ref="proTree"
      :requestApi="getComponentCategoryEnumTree"
      :initParam="initParamCategory"
      :dataCallback="dataCallbackTree"
      @handle-node-click="handleCategorySelect"
    >
      <template #treeHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openComponentCategoryDrawer('New')" v-if="BUTTONS.add"></el-button>
        <el-button
          :icon="EditPen"
          :disabled="scope.row.id === ''"
          @click="openComponentCategoryDrawer('Edit', scope.row as unknown as ComponentCategory.ResGetComponentCategoryRecord)"
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
        pageAuthId="categories"
        :columns="columns"
        :requestApi="getComponentList"
        :initParam="initParam"
        :isPageable="true"
        :dataCallback="dataCallbackTable"
      >
        <!-- Table header button -->
        <template #tableHeader="scope">
          <el-button type="primary" :icon="CirclePlus" @click="openComponentDrawer('New')" v-if="BUTTONS.add">
            New Component
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
          <!-- {{ scope.row }} -->
          <ComponentDetails
            :title="scope.row.mpn ?? ''"
            :isView="true"
            :rowData="scope.row"
            :enum-map="proTable.enumMap"
          ></ComponentDetails>
        </template>
        <template #stock="scope">
          {{ scope.row.stock }}
        </template>
        <!-- Table operation -->
        <template #operation="scope">
          <el-button type="primary" link :icon="EditPen" @click="openComponentDrawer('Edit', scope.row)">Edit</el-button>
        </template>
      </ProTable>
      <ComponentDrawer ref="drawerRefComponent"></ComponentDrawer>
      <ComponentCategoryDrawer ref="drawerRefComponentCategory"></ComponentCategoryDrawer>
    </div>
  </div>
</template>

<script setup lang="tsx" name="categories">
import { ref, reactive } from "vue";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
import { ColumnProps } from "@/components/ProTable/interface/index";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import ProTree from "@/components/ProTree/index.vue";
import ComponentDrawer from "@/views/inventory/components/ComponentDrawer.vue";
import ComponentCategoryDrawer from "@/views/categories/components/ComponentCategoryDrawer.vue";
import ComponentDetails from "@/views/inventory/components/ComponentDetails.vue";
import { filterNodeMethod } from "@/utils/filterNodeMethod";
import { ListResult, Component, ComponentCategory } from "@/api/interface";
import {
  getComponentList,
  postComponentCreate,
  patchComponentUpdate,
  deleteComponents,
  // getComponentCategoryEnum,
  getComponentCategoryEnumTree,
  postComponentCategoryCreate,
  patchComponentCategoryUpdate,
  deleteComponentCategories,
  getFootprintsEnum,
  getStorageLocationPathEnumTree
} from "@/api/modules/components";

// Get the ProTable element and call it to get the refresh data method (you can also get the current query parameter, so that it is convenient for exporting and carrying parameters)
const proTable = ref();
const proTree = ref();

// If the table needs to initialize the request parameter, it will be directly defined to the propable (each request will automatically bring the parameter every time, and it will always be brought to
const initParam = reactive<Partial<Component.ReqGetComponentListParams>>({
  expand: "category"
  // filter: { name: undefined, category: undefined, description: undefined }
});

const initParamCategory = reactive({});

// DataCallBack is processed to the returned table data. If the data returned in the background is not DataList && Total && PAGENUM && PageSize, then you can process these fields here.
const dataCallbackTree = (data: any) => {
  return data;
};
const dataCallbackTable = (data: ListResult<Component.ResGetComponentRecord>) => {
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
const columns: ColumnProps<Component.ResGetComponentRecord>[] = [
  { type: "selection", width: 40, fixed: "left" },
  { type: "expand", label: "" },
  {
    prop: "category",
    label: "Category",
    align: "left",
    enum: getComponentCategoryEnumTree,
    fieldNames: { value: "id", label: "_fullName" },
    sortable: true,
    search: {
      el: "tree-select",
      props: {
        props: { value: "id", label: "name" },
        filterable: true,
        filterNodeMethod: (v: any, d: any) => filterNodeMethod(v, d["_fullName"]),
        multiple: true
      }
    },
    isShow: false
  },
  {
    prop: "name",
    label: "Display Name",
    width: 260,
    align: "left",
    sortable: false,
    render: (scope: { row: Component.ResGetComponentRecord }) => {
      return (
        <>
          {scope.row.manufacturer} - {scope.row.mpn}
        </>
      );
    }
  },
  {
    prop: "manufacturer",
    label: "Mfr.",
    width: 130,
    sortable: true,
    search: { el: "input" },
    isShow: false
  },
  {
    prop: "mpn",
    label: "MPN",
    width: 130,
    sortable: true,
    search: { el: "input" },
    isShow: false
  },
  {
    prop: "description",
    label: "Description",
    // width: 220,
    align: "left",
    search: { el: "input" }
  },
  {
    prop: "footprint",
    label: "Footprint",
    width: 120,
    enum: getFootprintsEnum,
    fieldNames: { value: "id", label: "name" },
    sortable: true,
    search: {
      el: "select",
      props: {
        value: "id",
        label: "name",
        multiple: true,
        filterable: true
      }
    },
    isShow: false
  },
  { prop: "stock", label: "Stock", width: 80 },
  {
    prop: "ipn",
    label: "IPN",
    width: 60,
    search: { el: "input" },
    isShow: false
  },
  // {
  //   prop: "storage_location",
  //   label: "Short Location",
  //   width: 160,
  //   enum: getComponentStorageLocationEnum,
  //   fieldNames: { value: "id", label: "name" },
  //   sortable: true,
  //   search: { el: "select" },
  //   //
  //   // searchType: "select",
  //   // enumFunction: getComponentStorageLocationEnum,
  //   // searchProps: { value: "id", label: "name" },
  //   isShow: true
  // },

  {
    prop: "storage_location",
    label: "Location",
    width: 160,
    align: "left",
    enum: getStorageLocationPathEnumTree,
    // isFilterEnum: false,
    fieldNames: { value: "id", label: "_fullName" },
    sortable: true,
    search: {
      el: "tree-select",
      props: {
        props: { value: "id", label: "name", disabled: "disabled" },
        filterable: true,
        filterNodeMethod: (v: any, d: any) => filterNodeMethod(v, d["_fullName"]),
        multiple: true
      }
    },
    // render: (scope: { row: Component.ResGetComponentRecord }) => {
    //   return <div>{scope.row}</div>;
    // },
    isShow: true
  },
  {
    prop: "created",
    label: "Created",
    width: 200,
    sortable: true,
    search: { el: "date-picker", span: 1, props: { type: "datetimerange" } },
    isShow: false
  },
  {
    prop: "updated",
    label: "Updated",
    width: 200,
    sortable: true,
    search: { el: "date-picker", span: 1, props: { type: "datetimerange" } },
    isShow: false
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
  await useHandleData(deleteComponents, { ids }, "Delete the selected footprints(s)");
  proTable.value.getTableList();
  proTable.value.clearSelection();
};

// Batch delete footprints
const batchDeleteCategory = async (ids: string[]) => {
  await useHandleData(deleteComponentCategories, { ids }, "Delete the selected footprint categories(s)");
  proTree.value.refresh();
};

// Open the drawer (new, view, edit)
const drawerRefComponent = ref<InstanceType<typeof ComponentDrawer>>();
const openComponentDrawer = (title: string, rowData?: Component.ResGetComponentRecord) => {
  let params = {
    title,
    rowData: rowData || ({} as Component.ResGetComponentRecord),
    isView: title === "View",
    apiUrl: title === "New" ? postComponentCreate : title === "Edit" ? patchComponentUpdate : undefined,
    updateTable: proTable.value.getTableList
  };
  drawerRefComponent.value!.acceptParams(params);
};

const drawerRefComponentCategory = ref<InstanceType<typeof ComponentCategoryDrawer>>();
const openComponentCategoryDrawer = (title: string, rowData?: ComponentCategory.ResGetComponentCategoryRecord) => {
  let params = {
    title,
    rowData: rowData || ({} as ComponentCategory.ResGetComponentCategoryRecord),
    isView: title === "View",
    apiUrl: title === "New" ? postComponentCategoryCreate : title === "Edit" ? patchComponentCategoryUpdate : undefined,
    updateTable: proTree.value.refresh
  };
  drawerRefComponentCategory.value!.acceptParams(params);
};
</script>
