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
          @click="batchDelete(scope.ids)"
          v-if="BUTTONS.batchDelete"
        >
          Delete
        </el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <template #stock="scope">
        {{ scope.row.stock }}
        <el-button type="primary" link :icon="DCaret" @click="openDrawer('Stock', scope.row)"></el-button>
      </template>

      <!-- Table operation -->
      <template #action="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('Edit', scope.row)">Edit</el-button>
      </template>
    </ProTable>
    <ComponentDrawer ref="drawerRef"></ComponentDrawer>
    <ImportExcel ref="dialogRef"></ImportExcel>
  </div>
</template>

<script setup lang="tsx" name="useComponent">
import { ref, reactive } from "vue";
import { ResList, Component } from "@/api/interface";
import { ColumnProps } from "@/components/ProTable/interface/index";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { JSON2CSV } from "@/hooks/useDataTransform";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import ComponentDrawer from "@/views/inventory/components/ComponentDrawer.vue";
import { CirclePlus, Delete, EditPen, Download, Upload, DCaret } from "@element-plus/icons-vue";
import {
  getComponentList,
  getComponentsListForExport,
  postComponentCreate,
  patchComponentUpdate,
  deleteComponents,
  getFootprintsEnum,
  getComponentStorageLocationEnum,
  getComponentCategoryEnum,
  getComponentCategoryEnumTree,
  getStorageLocationPathEnum,
  getStorageLocationPathEnumTree,
  getStorageCategoryEnum,
  getStorageCategoryEnumTree,
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
  console.error("dataCallback", data.items);
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
const columns: Partial<ColumnProps>[] = [
  { type: "selection", width: 40, fixed: "left" },
  { type: "expand", label: "" },
  {
    prop: "category",
    label: "Category",
    align: "left",
    // values that go into the treeSelect props
    searchProps: {
      value: "id",
      label: "_fullName",
      props: { value: "id", label: "name", emitPath: false },
      checkStrictly: true
    },
    sortable: true,
    search: true,
    // searchType: "select",
    searchType: "treeSelect",
    // renderText: (data: Component.ResGetComponentRecord) => data["@expand"].category.name,
    enumFunction: getComponentCategoryEnum,
    enumTreeFunction: getComponentCategoryEnumTree,
    isShow: false
  },
  {
    prop: "name",
    label: "Name",
    width: 160,
    sortable: true,
    renderText: (data: Component.ResGetComponentRecord) => `${data.manufacturer} - ${data.mpn}`
    // isShow: false
  },
  {
    prop: "manufacturer",
    label: "Mfr.",
    width: 130,
    sortable: true,
    search: true,
    searchType: "text",
    // searchProps: { disabled: true },
    isShow: false
  },
  {
    prop: "mpn",
    label: "MPN",
    width: 130,
    sortable: true,
    search: true,
    searchType: "text",
    // searchProps: { disabled: true },
    isShow: false
  },
  {
    prop: "description",
    label: "Description",
    // width: 220,
    search: true,
    searchType: "text"
  },
  // enum: It can be directly an array object, or it can be the request method.
  // enum: When the request method is required, the number of array objects returned in the background is not the case of Label and Value. You can specify the KEY value of label and value in SearchProps
  {
    prop: "footprint",
    label: "Footprint",
    width: 120,
    sortable: true,
    search: true,
    searchType: "multipleSelect",
    enumFunction: getFootprintsEnum,
    searchProps: { value: "id", label: "name" },
    isShow: false
  },
  { prop: "stock", label: "Stock", width: 80, search: false },
  {
    prop: "ipn",
    label: "IPN",
    width: 60,
    search: true,
    searchType: "text",
    // searchProps: { disabled: true },
    isShow: false
  },
  // {
  //   prop: "storage_location",
  //   label: "Location",
  //   sortable: true,
  //   search: true,
  //   searchType: "select",
  //   // renderText: (data: Component.ResGetComponentRecord) => data["@expand"].storage_location.name
  //   enumFunction: getComponentStorageLocationEnum,
  //   searchProps: { value: "id", label: "name" },
  //   isShow: true
  // },

  {
    prop: "storage_location",
    label: "Location",
    sortable: true,
    search: true,
    // values that go into the treeSelect props
    searchProps: {
      value: "id",
      label: "_fullName",
      props: { value: "id", label: "name", emitPath: false },
      checkStrictly: true
    },
    searchType: "treeSelect",
    // renderText: (data: Component.ResGetComponentRecord) => data["@expand"].category.name,
    enumFunction: getStorageLocationPathEnum,
    enumTreeFunction: getStorageLocationPathEnumTree,
    isShow: true
  },
  // {
  // 	prop: "createTime",
  // 	label: "Creation time",
  // 	width: 200,
  // 	sortable: true,
  // 	search: true,
  // 	searchType: "datetimerange",
  // 	searchProps: {
  // 		disabledDate: (time: Date) => time.getTime() < Date.now() - 8.64e7
  // 	},
  // 	searchInitParam: ["2022-08-30 00:00:00", "2022-08-20 23:59:59"]
  // },
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
const dialogRef = ref<DialogExpose>();
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
  dialogRef.value!.acceptParams(params);
};

// Open the drawer (new, view, edit)
interface DrawerExpose {
  acceptParams: (params: any) => void;
}
const drawerRef = ref<DrawerExpose>();
const openDrawer = (title: string, rowData: Partial<Component.ResGetComponentRecord> = {}) => {
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
</script>
