<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      pageAuthId="inventory"
      :columns="columns"
      :requestApi="getComponentList"
      :initParam="initParam"
      :isPageable="true"
      :dataCallback="dataCallback"
    >
      <!-- Table header button -->
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('New')" v-if="BUTTONS.add"> New Component </el-button>
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
        <el-button
          :icon="Switch"
          plain
          :disabled="scope.selectedListIds.length !== 2"
          @click="openMergeDialog(scope.selectedListIds, scope.selectedList)"
          v-if="BUTTONS.merge"
        >
          Merge
        </el-button>
        <el-button :icon="Upload" plain @click="batchAdd" v-if="BUTTONS.batchAdd">Import</el-button>
        <el-button :icon="Download" plain @click="downloadFile" v-if="BUTTONS.export">Export</el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        <ComponentDetails
          :title="scope.row.mpn ?? ''"
          :isView="true"
          :rowData="scope.row"
          :enum-map="proTable!.enumMap"
        ></ComponentDetails>
      </template>
      <template #stock="scope">
        {{ scope.row.stock }}
        <el-button type="primary" link :icon="DCaret" @click="openStockDrawer('Stock', scope.row)"></el-button>
      </template>

      <!-- Table operation -->
      <template #operation="scope">
        <el-button type="primary" link :icon="CopyDocument" @click="openDrawer('New', scope.row)">Clone</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('Edit', scope.row)">Edit</el-button>
      </template>
    </ProTable>
    <ComponentDrawer ref="drawerRef"></ComponentDrawer>
    <ComponentStockEdit ref="drawerRefComponentStockEdit"></ComponentStockEdit>
    <ImportExcel ref="dialogRefImport"></ImportExcel>
    <MergeComponents ref="dialogRefMerge"></MergeComponents>
  </div>
</template>

<script setup lang="tsx" name="inventory">
import { ref, reactive } from "vue";
import { CirclePlus, Delete, EditPen, Download, Upload, DCaret, Switch, CopyDocument } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";

// Components
import { ColumnProps } from "@/components/ProTable/interface/index";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "./components/ImportExcel.vue";
import ComponentDrawer from "@/views/inventory/components/ComponentDrawer.vue";
import ComponentStockEdit from "@/views/inventory/components/ComponentStockEdit.vue";
import ComponentDetails from "@/views/inventory/components/ComponentDetails.vue";
import MergeComponents from "./components/MergeComponents.vue";

// Hooks
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { useDownload } from "@/hooks/useDownload";
import { JSON2CSV } from "@/hooks/useDataTransform";

// Utils
import { filterNodeMethod } from "@/utils/filterNodeMethod";

// API
import {
  ListResult,
  Component
  // ComponentCategory,
  // Footprint,
  // Storage
} from "@/api/interface";
import {
  getComponentList,
  getComponentsListForExport,
  postComponentCreate,
  patchComponentUpdate,
  postComponentsUpload,
  deleteComponents,
  getFootprintsEnum,
  // getComponentStorageLocationEnum,
  // getComponentCategoryEnum,
  getComponentCategoryEnumTree,
  // getStorageLocationPathEnum,
  getStorageLocationPathEnumTree,
  // getStorageCategoryEnum,
  // getStorageCategoryEnumTree,
  // postComponentCreateBatch_Client,
  // postComponentCategoryCreate,
  // postStorageCreate,
  // postFootprintCreate
  getComponentEnum
} from "@/api/modules/components";

// Get the ProTable element and call it to get the refresh data method (you can also get the current query parameter, so that it is convenient for exporting and carrying parameters)
const proTable = ref<InstanceType<typeof ProTable>>();
// If the table needs to initialize the request parameter, it will be directly defined to the propable (each request will automatically bring the parameter every time, and it will always be brought to
const initParam = reactive({
  expand: "footprint, category, storage_location, storage_categories"
});

// DataCallBack is processed to the returned table data. If the data returned in the background is not DataList && Total && PAGENUM && PageSize, then you can process these fields here.
const dataCallback = (data: ListResult<Component.ResGetComponentRecord>) => {
  return {
    list: data.items,
    total: data.totalItems,
    pageNum: data.page,
    pageSize: data.perPage
  };
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
    render: (_scope): string => {
      return `${_scope.row.manufacturer} - ${_scope.row.mpn}`;
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
    label: "Desc.",
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
    width: 100,
    search: { el: "input" },
    isShow: true
  },
  {
    prop: "storage_location",
    label: "Location",
    width: 160,
    align: "left",
    enum: getStorageLocationPathEnumTree,
    // isFilterEnum: false,
    fieldNames: { value: "id", label: "name" },
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
    isShow: true
  },
  {
    prop: "operation",
    label: "Operation",
    width: 180,
    fixed: "right"
  }
];

// Batch delete components
const batchDelete = async (ids: string[]) => {
  if (!proTable.value) {
    console.error("ProTable is not initialized");
    ElNotification({
      title: "Notification",
      message: "ProTable is not initialized",
      type: "error"
    });
    return;
  }

  await useHandleData(deleteComponents, { ids }, "Delete the selected component(s)");
  proTable.value.getTableList();
  proTable.value.clearSelection();
};

// Export component list
const downloadFile = async () => {
  if (!proTable.value) {
    console.error("ProTable is not initialized");
    ElNotification({
      title: "Notification",
      message: "ProTable is not initialized",
      type: "error"
    });
    return;
  }
  // useDownload(exportUserInfo, "user list", proTable.value.searchParam);
  let name = "all";
  let json = await getComponentsListForExport({
    filter: proTable.value.searchParam
  });

  let columns = proTable.value.tableColumns.map((c: Partial<ColumnProps>) => c.prop ?? "").filter((c: string) => c);
  // remove specific columns from array
  let badColumns = ["operation", "expand", "selection", "footprint", "name"];
  columns = columns.filter((c: string) => !badColumns.includes(c));

  let csv = JSON2CSV(json, columns);
  useDownload(() => csv, `${name}_component_list`, {}, true, ".csv");
};

// Add components in batches
const dialogRefImport = ref<InstanceType<typeof ImportExcel>>();
const batchAdd = async () => {
  if (!proTable.value) {
    console.error("ProTable is not initialized");
    ElNotification({
      title: "Notification",
      message: "ProTable is not initialized",
      type: "error"
    });
    return;
  }
  let templateColumns = [
    { prop: "mpn", label: "MPN" },
    { prop: "manufacturer", label: "Manufacturer" },
    { prop: "description", label: "Description" },
    {
      prop: "category",
      label: "Category",
      uniqueKey: "name",
      mergeOptions: { single: true }
    },
    { prop: "stock", label: "Stock", mergeOptions: { required: true, defaultBoth: true } },
    { prop: "footprint", label: "Footprint", mergeOptions: { single: true } },
    { prop: "ipn", label: "IPN", mergeOptions: { single: true } },
    {
      prop: "storage_location",
      label: "Location",
      uniqueKey: "name",
      mergeOptions: { single: true }
    }
  ];
  let params = {
    title: "Components",
    columns: templateColumns,
    uniqueKey: "mpn",
    enumMap: proTable.value.enumMap,
    apiGetExistingEntries: async () => await getComponentsListForExport({ filter: {} }), // existingEntries,
    apiUpload: postComponentsUpload,
    refresh: proTable.value.getTableList
  };
  dialogRefImport.value!.acceptParams(params);
};

const dialogRefMerge = ref<InstanceType<typeof MergeComponents>>();
const openMergeDialog = (ids: string[], selectList: Record<string, any>[]) => {
  if (!proTable.value) {
    console.error("ProTable is not initialized");
    ElNotification({
      title: "Notification",
      message: "ProTable is not initialized",
      type: "error"
    });
    return;
  }
  let params = {
    title: "Merge Components",
    // ids,
    leftComponent: JSON.parse(JSON.stringify(selectList[0])),
    rightComponent: JSON.parse(JSON.stringify(selectList[1])),
    enumMap: proTable.value.enumMap,
    apiUrlUpdate: patchComponentUpdate,
    apiUrlDelete: deleteComponents,
    updateTable: proTable.value.getTableList
  };
  dialogRefMerge.value!.acceptParams(params);
};

// Open the drawer (new, view, edit)
const drawerRef = ref<InstanceType<typeof ComponentDrawer>>();
const openDrawer = (title: string, rowData?: Component.ResGetComponentRecord) => {
  if (title === "New" && rowData) {
    // Remove id if present
    let { id, ...rest } = rowData;
    rowData = rest as Component.ResGetComponentRecord;
  }
  let params = {
    title,
    rowData: { ...rowData } as Component.ResGetComponentRecord,
    isView: title === "View",
    apiUrl:
      title === "New"
        ? postComponentCreate
        : title === "Edit"
          ? patchComponentUpdate
          : title === "Stock"
            ? patchComponentUpdate
            : undefined,
    updateTable: proTable.value!.getTableList
  };
  drawerRef.value!.acceptParams(params);
};

// Open the stock drawer
const drawerRefComponentStockEdit = ref<InstanceType<typeof ComponentStockEdit>>();
const openStockDrawer = (title: string, rowData?: Component.ResGetComponentRecord) => {
  let params = {
    title: `${rowData!.manufacturer} - ${rowData!.mpn}`,
    rowData: { ...rowData } as Component.ResGetComponentRecord,
    isView: false,
    addStock: 0,
    apiUrl: patchComponentUpdate,
    updateTable: proTable.value!.getTableList
  };
  drawerRefComponentStockEdit.value!.acceptParams(params);
};
</script>
