<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :requestApi="getComponentLogsList"
      :initParam="initParam"
      :isPageable="true"
      :dataCallback="dataCallback"
    >
      <!-- Table header button -->
      <template #tableHeader="scope">
        <!-- <el-button type="primary" :icon="CirclePlus" @click="openDrawer('New')" v-if="BUTTONS.add">New Component</el-button>
        <el-button type="primary" :icon="Upload" plain @click="batchAdd" v-if="BUTTONS.batchAdd">Import</el-button>
        <el-button type="primary" :icon="Download" plain @click="downloadFile" v-if="BUTTONS.export">Export</el-button> -->
        <!-- <el-button
          type="danger"
          :icon="Delete"
          plain
          :disabled="!scope.isSelected"
          @click="batchDelete(scope.ids)"
          v-if="BUTTONS.batchDelete"
        >
          Delete
        </el-button> -->
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- Table operation -->
      <template #action="scope">
        <el-button type="primary" link :icon="ZoomIn" @click="openDrawer('View', scope.row)">View</el-button>
      </template>
    </ProTable>
    <ComponentDrawer ref="drawerRef"></ComponentDrawer>
  </div>
</template>

<script setup lang="tsx" name="useComponent">
import { ref, reactive } from "vue";
import { CirclePlus, Delete, EditPen, Download, Upload, DCaret, ZoomIn } from "@element-plus/icons-vue";
import { ColumnProps } from "@/components/ProTable/interface/index";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import ComponentDrawer from "@/views/inventory/components/ComponentDrawer.vue";
import { ResList, Component, ComponentLog } from "@/api/interface";
import {
  getComponent,
  getComponentList,
  postComponentCreate,
  patchComponentUpdate,
  getComponentLogsList
} from "@/api/modules/components";

// Get the ProTable element and call it to get the refresh data method (you can also get the current query parameter, so that it is convenient for exporting and carrying parameters)
const proTable = ref();
// If the table needs to initialize the request parameter, it will be directly defined to the propable (each request will automatically bring the parameter every time, and it will always be brought to
const initParam = reactive({});

// DataCallBack is processed to the returned table data. If the data returned in the background is not DataList && Total && PAGENUM && PageSize, then you can process these fields here.
const dataCallback = (data: ResList<ComponentLog.ResGetComponentLogRecord>) => {
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
  // { type: "selection", width: 40, fixed: "left" },
  { type: "expand", label: "" },
  {
    prop: "component",
    label: "Component",
    width: 260,
    align: "left",
    sortable: false
    // renderText: (data: Component.ResGetComponentRecord) => `${data.manufacturer} - ${data.mpn}`
    // isShow: false
  },
  {
    prop: "description",
    label: "Description",
    // width: 220,
    align: "left",
    search: true,
    searchType: "text"
  },
  {
    prop: "created",
    label: "Created",
    width: 200,
    sortable: true,
    search: true,
    searchType: "datetimerange",
    searchProps: {
      // disabledDate: (time: Date) => time.getTime() < Date.now() - 8.64e7
    },
    // searchInitParam: ["2000-09-30 00:00:00", "2042-09-20 23:59:59"],
    isShow: true
  },
  {
    prop: "updated",
    label: "Updated",
    width: 200,
    sortable: true,
    search: true,
    searchType: "datetimerange",
    searchProps: {
      //   disabledDate: (time: Date) => time.getTime() < Date.now() - 8.64e7
    },
    // searchInitParam: ["2000-09-30 00:00:00", "2042-09-20 23:59:59"],
    isShow: false
  },
  {
    prop: "action",
    label: "Action",
    width: 100,
    fixed: "right"
  }
];

// Open the drawer (new, view, edit)
interface DrawerExpose {
  acceptParams: (params: any) => void;
}
const drawerRef = ref<DrawerExpose>();
const openDrawer = (title: string, rowData: Partial<ComponentLog.ResGetComponentLogRecord> = {}) => {
  let referenceComponentRowData: Partial<Component.ResGetComponentRecord> = {};
  getComponent(String(rowData.component)).then(res => {
    referenceComponentRowData = res.data;

    let params = {
      title,
      rowData: referenceComponentRowData, //{ ...referenceComponentRowData },
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
  });
};
</script>
