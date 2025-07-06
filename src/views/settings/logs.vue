<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      pageAuthId="builds"
      :columns="columns"
      :requestApi="getComponentLogsList"
      :initParam="initParam"
      :isPageable="true"
      :dataCallback="dataCallback"
    >
      <!-- Table header button -->
      <template #tableHeader>
        <el-button :icon="Download" plain @click="downloadFile" v-if="BUTTONS.export">Export</el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        <!-- {{ scope.row }} -->
        <CompareComponentDetails
          :componentA="(scope.row as ComponentLog.ResGetComponentLogRecord).old_value"
          :componentB="(scope.row as ComponentLog.ResGetComponentLogRecord).new_value"
          :isView="true"
        />
      </template>
      <!-- Table operation -->
      <template #operation="scope">
        <el-button type="primary" link :icon="ZoomIn" @click="openDrawer('View', scope.row)">View</el-button>
      </template>
    </ProTable>
    <ComponentDrawer ref="drawerRef"></ComponentDrawer>
  </div>
</template>

<script setup lang="tsx" name="logs">
import { ref, reactive } from "vue";
import { ZoomIn, Download } from "@element-plus/icons-vue";
import { ColumnProps, PageableList } from "@/components/ProTable/interface/index";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import ComponentDrawer from "@/views/inventory/components/ComponentDrawer.vue";
import CompareComponentDetails from "@/views/settings/components/CompareComponentDetails.vue";
import { ResList, Component, ComponentLog } from "@/api/interface";
import { useDownload } from "@/hooks/useDownload";
import { JSON2CSV } from "@/hooks/useDataTransform";
import {
  getComponent,
  getComponentLogsListForExport,
  postComponentCreate,
  patchComponentUpdate,
  getComponentLogsList
} from "@/api/modules/components";

// Get the ProTable element and call it to get the refresh data method (you can also get the current query parameter, so that it is convenient for exporting and carrying parameters)
const proTable = ref<InstanceType<typeof ProTable>>();
// If the table needs to initialize the request parameter, it will be directly defined to the propable (each request will automatically bring the parameter every time, and it will always be brought to
const initParam = reactive({});

// DataCallBack is processed to the returned table data. If the data returned in the background is not DataList && Total && PAGENUM && PageSize, then you can process these fields here.
const dataCallback = (
  data: ResList<ComponentLog.ResGetComponentLogRecord>
): PageableList<ComponentLog.ResGetComponentLogRecord> => {
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
const columns: Partial<ColumnProps>[] = [
  // { type: "selection", width: 40, fixed: "left" },
  { type: "expand", label: "" },
  {
    prop: "component",
    label: "Component ID",
    // width: 260,
    align: "left",
    search: { el: "input" },
    sortable: false
    // isShow: false
  },
  {
    prop: "__mpn__",
    label: "Component MPN",
    width: 260,
    align: "left",
    // search: { el: "input", props: { props: { value: "id", label: "mpn" } } },
    // enum: getComponentEnum,
    // fieldNames: { value: "id", label: "component" },
    sortable: false,
    render: (scope: { row: ComponentLog.ResGetComponentLogRecord }) =>
      `${scope.row.old_value?.mpn ?? ""} | ${scope.row.new_value?.mpn ?? ""}`
    // isShow: false
  },
  {
    prop: "old_value",
    label: "Component Old MPN",
    width: 260,
    align: "left",
    search: { el: "input", props: { props: { value: "old_value.mpn", label: "mpn" } } },
    // enum: getComponentEnum,
    // fieldNames: { value: "id", label: "component" },
    sortable: false,
    render: (scope: { row: ComponentLog.ResGetComponentLogRecord }) => scope.row.old_value.mpn,
    isShow: false
  },
  {
    prop: "new_value",
    label: "Component New MPN",
    width: 260,
    align: "left",
    search: { el: "input", props: { props: { value: "new_value.mpn", label: "mpn" } } },
    // enum: getComponentEnum,
    // fieldNames: { value: "id", label: "component" },
    sortable: false,
    render: (scope: { row: ComponentLog.ResGetComponentLogRecord }) => scope.row.new_value.mpn,
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
    prop: "created",
    label: "Timestamp",
    width: 200,
    sortable: true,
    search: { el: "date-picker", span: 1, props: { type: "datetimerange" } },
    isShow: true
  },
  // {
  //   prop: "updated",
  //   label: "Updated",
  //   width: 200,
  //   sortable: true,
  //   search: true,
  //   searchType: "datetimerange",
  //   searchProps: {
  //     //   disabledDate: (time: Date) => time.getTime() < Date.now() - 8.64e7
  //   },
  //   // searchInitParam: ["2000-09-30 00:00:00", "2042-09-20 23:59:59"],
  //   isShow: false
  // },
  {
    prop: "operation",
    label: "Operation",
    width: 100,
    fixed: "right"
  }
];

// Export component list
const downloadFile = async () => {
  if (!proTable.value) {
    console.error("ProTable is not initialized");
    return;
  }

  // useDownload(exportUserInfo, "user list", proTable.value.searchParam);
  let name = "all";
  let json = await getComponentLogsListForExport({
    filter: proTable.value.searchParam
  });

  let columns = proTable.value.tableColumns.map((c: Partial<ColumnProps>) => c.prop ?? "").filter((c: string) => c);
  // remove specific columns from array
  let removeColumns = ["operation", "expand", "selection", "footprint", "name"];
  columns = columns.filter((c: string) => !removeColumns.includes(c));

  let csv = JSON2CSV(json, columns);
  useDownload(() => csv, `${name}_component_list`, {}, true, ".csv");
};

// Open the drawer (new, view, edit)
const drawerRef = ref<InstanceType<typeof ComponentDrawer>>();
const openDrawer = async (title: string, rowData?: ComponentLog.ResGetComponentLogRecord) => {
  if (!rowData) {
    console.error("Row data is not provided");
    return;
  }
  let referenceComponentRowData = await getComponent(String(rowData.component));
  let params = {
    title,
    rowData: { ...(referenceComponentRowData as Component.ResGetComponentRecord) },
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
</script>
