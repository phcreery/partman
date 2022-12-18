<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :requestApi="getComponentList"
      :initParam="initParam"
      :isPageable="true"
      :dataCallback="dataCallback"
    >
      <!-- Table header button -->
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('New')" v-if="BUTTONS.add">New Component</el-button>
        <el-button type="primary" :icon="Upload" plain @click="batchAdd" v-if="BUTTONS.batchAdd">Import</el-button>
        <el-button type="primary" :icon="Download" plain @click="downloadFile" v-if="BUTTONS.export">Export</el-button>
        <el-button
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.selectedListIds)"
          v-if="BUTTONS.batchDelete"
        >
          Delete
        </el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        <!-- {{ scope.row }} -->
        <ComponentDetails :title="scope.row.name" :isView="true" :rowData="scope.row"></ComponentDetails>
      </template>
      <template #stock="scope">
        {{ scope.row.stock }}
        <el-button type="primary" link :icon="DCaret" @click="openStockDrawer('Stock', scope.row)"></el-button>
      </template>

      <!-- Table operation -->
      <template #action="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('Edit', scope.row)">Edit</el-button>
      </template>
    </ProTable>
    <ComponentDrawer ref="drawerRef"></ComponentDrawer>
    <ComponentStockEdit ref="drawerRefComponentStockEdit"></ComponentStockEdit>
    <ImportExcel ref="dialogRefImport"></ImportExcel>
  </div>
</template>

<script setup lang="tsx" name="useComponent">
import { ref, reactive } from "vue";
import { CirclePlus, Delete, EditPen, Download, Upload, DCaret } from "@element-plus/icons-vue";
import { ColumnProps } from "@/components/ProTable/interface/index";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { JSON2CSV } from "@/hooks/useDataTransform";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import ComponentDrawer from "@/views/inventory/components/ComponentDrawer.vue";
import ComponentStockEdit from "@/views/inventory/components/ComponentStockEdit.vue";
import ComponentDetails from "@/views/inventory/components/ComponentDetails.vue";
import {
  ResList,
  Component
  // ComponentCategory, Footprint, Storage
} from "@/api/interface";
import {
  getComponentList,
  getComponentsListForExport,
  postComponentCreate,
  patchComponentUpdate,
  deleteComponents,
  getFootprintsEnum,
  // getComponentStorageLocationEnum,
  // getComponentCategoryEnum,
  getComponentCategoryEnumTree,
  // getStorageLocationPathEnum,
  getStorageLocationPathEnumTree,
  // getStorageCategoryEnum,
  // getStorageCategoryEnumTree,
  postComponentCreateBatch_Client
} from "@/api/modules/components";

// Get the ProTable element and call it to get the refresh data method (you can also get the current query parameter, so that it is convenient for exporting and carrying parameters)
const proTable = ref();
// If the table needs to initialize the request parameter, it will be directly defined to the propable (each request will automatically bring the parameter every time, and it will always be brought to
const initParam = reactive({
  expand: "footprint, category, storage_location, storage_categories"
});

// DataCallBack is processed to the returned table data. If the data returned in the background is not DataList && Total && PAGENUM && PageSize, then you can process these fields here.
const dataCallback = (data: ResList<Component.ResGetComponentRecord>) => {
  return {
    datalist: data.items,
    total: data.totalItems,
    pageNum: data.page,
    pageSize: data.perPage
  };
};
// Page button permission
const { BUTTONS } = useAuthButtons();

// Table configuration item
const columns: ColumnProps[] = [
  { type: "selection", width: 40, fixed: "left" },
  { type: "expand", label: "" },
  {
    prop: "category",
    label: "Category",
    align: "left",
    enum: getComponentCategoryEnumTree,
    fieldNames: { value: "id", label: "name" },
    sortable: true,
    search: {
      el: "tree-select",
      props: {
        props: { value: "id", label: "name" }
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
        <div>
          {scope.row.manufacturer} - {scope.row.mpn}
        </div>
      );
    }
    // isShow: false
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
    prop: "supplier",
    label: "Supplier",
    width: 130,
    sortable: true,
    search: { el: "input" },
    isShow: false
  },
  {
    prop: "spn",
    label: "SPN",
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
    search: { el: "select", props: { value: "id", label: "name", multiple: true } },
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
  {
    prop: "storage_location",
    label: "Short Location",
    width: 160,
    sortable: true,
    isShow: false
  },

  {
    prop: "storage_location",
    label: "Location",
    width: 160,
    align: "left",
    enum: getStorageLocationPathEnumTree,
    fieldNames: { value: "id", label: "name" },
    sortable: true,
    search: {
      el: "tree-select",
      props: {
        props: { value: "id", label: "name" }
      }
    },
    isShow: true
  },
  {
    prop: "created",
    label: "Created",
    width: 200,
    sortable: true,
    search: { el: "date-picker", span: 1, props: { type: "datetimerange" } }, // true,
    isShow: false
  },
  {
    prop: "updated",
    label: "Updated",
    width: 200,
    sortable: true,
    search: { el: "date-picker", span: 1, props: { type: "datetimerange" } }, // true,
    isShow: false
  },
  {
    prop: "action",
    label: "Action",
    width: 100,
    fixed: "right"
  }
];

// Delete user information
// const deleteComponent = async (params: Component.ResGetComponentRecord) => {
// 	await useHandleData(deleteComponents, { ids: [params.id] }, `Delete [${params.name}] component`);
// 	proTable.value.refresh();
// };
// Batch delete components
const batchDelete = async (ids: string[]) => {
  await useHandleData(deleteComponents, { ids }, "Delete the selected component(s)");
  proTable.value.refresh();
};
// Export component list
const downloadFile = async () => {
  // useDownload(exportUserInfo, "user list", proTable.value.searchParam);
  let name = "all";
  let json = await getComponentsListForExport({
    filter: proTable.value.searchParam
  });

  let columns = proTable.value.tableColumns.map((c: Partial<ColumnProps>) => c.prop ?? "");
  // remove specific columns from array
  let badColumns = ["action", "expand", "selection", "footprint", "name"];
  columns = columns.filter((c: string) => !badColumns.includes(c));

  let csv = JSON2CSV(json, columns);
  useDownload(() => csv, `${name}_component_list`, {}, true, ".csv");
};
// Add components in batches
interface DialogExpose {
  acceptParams: (params: any) => void;
}
const dialogRefImport = ref<DialogExpose>();
const batchAdd = () => {
  let columns = proTable.value.tableColumns.map((c: Partial<ColumnProps>) => c.prop ?? "");
  // remove specific columns from array
  let badColumns = ["action", "expand", "selection", "footprint", "name"];
  columns = columns.filter((c: string) => !badColumns.includes(c));
  let csv = JSON2CSV({}, columns);
  let params = {
    title: "component",
    tempApi: () => csv,
    importApi: postComponentCreateBatch_Client,
    getTableList: proTable.value.refresh
  };
  dialogRefImport.value!.acceptParams(params);
};

// Open the drawer (new, view, edit)
interface DrawerExpose {
  acceptParams: (params: any) => void;
}
const drawerRef = ref<DrawerExpose>();
const openDrawer = (title: string, rowData: Partial<Component.ResGetComponentRecord> = {}) => {
  /*eslint indent: ["error", 2, { "ignoredNodes": ["ConditionalExpression"] }]*/
  let params = {
    title,
    rowData: { ...rowData },
    isView: title === "View",
    apiUrl:
      title === "New"
        ? postComponentCreate
        : title === "Edit"
        ? patchComponentUpdate
        : title === "Stock"
        ? patchComponentUpdate
        : "",
    updateTable: proTable.value.refresh
  };
  drawerRef.value!.acceptParams(params);
};

// Open the stock drawer
const drawerRefComponentStockEdit = ref<DrawerExpose>();
const openStockDrawer = (title: string, rowData: Partial<Component.ResGetComponentRecord> = {}) => {
  let params = {
    title: `${rowData!.manufacturer} - ${rowData!.mpn}`,
    rowData: { ...rowData },
    isView: false,
    addStock: 0,
    apiUrl: patchComponentUpdate,
    updateTable: proTable.value.refresh
  };
  drawerRefComponentStockEdit.value!.acceptParams(params);
};
</script>