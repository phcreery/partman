<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      pageAuthId="users"
      :columns="columns"
      :requestApi="getUserList"
      :initParam="initParam"
      :isPageable="true"
      :dataCallback="dataCallback"
    >
      <!-- Table header button -->
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('New')" v-if="BUTTONS.add"> New User </el-button>
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
        <el-button :icon="Download" plain @click="downloadFile" v-if="BUTTONS.export">Export</el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        <!-- {{ scope.row }} -->
      </template>
      <!-- Table operation -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('Edit', scope.row)">Edit</el-button>
        <!-- <el-button type="primary" link :icon="ZoomIn" @click="openDrawer('View', scope.row)">View</el-button> -->
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef"></UserDrawer>
  </div>
</template>

<script setup lang="tsx" name="logs">
import { ref, reactive } from "vue";
import { ZoomIn, Download, CirclePlus, EditPen, Delete } from "@element-plus/icons-vue";

// Copmponents
import { ColumnProps, PageableList } from "@/components/ProTable/interface/index";
import ProTable from "@/components/ProTable/index.vue";

// View components
import UserDrawer from "./components/UserDrawer.vue";

// Hooks
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { useDownload } from "@/hooks/useDownload";
import { JSON2CSV } from "@/hooks/useDataTransform";

// API
import {
  getUser,
  getUserList,
  getUsersListForExport,
  postUserCreate,
  patchUserUpdate,
  deleteUsers
} from "@/api/modules/components";
import type { ListResult, User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { ElNotification } from "element-plus";

// Get the ProTable element and call it to get the refresh data method (you can also get the current query parameter, so that it is convenient for exporting and carrying parameters)
const proTable = ref<InstanceType<typeof ProTable>>();
// If the table needs to initialize the request parameter, it will be directly defined to the propable (each request will automatically bring the parameter every time, and it will always be brought to
const initParam = reactive({});

// DataCallBack is processed to the returned table data. If the data returned in the background is not DataList && Total && PAGENUM && PageSize, then you can process these fields here.
const dataCallback = (data: ListResult<User.ResGetUserRecord>): PageableList<User.ResGetUserRecord> => {
  return {
    list: data.items,
    total: data.totalItems,
    pageNum: data.page,
    pageSize: data.perPage
  };
};

// Page button permission
const { BUTTONS } = useAuthButtons();
console.log("BUTTONS", BUTTONS);

// Table configuration item
const columns: Partial<ColumnProps<User.ResGetUserRecord>>[] = [
  { type: "selection", width: 40, fixed: "left" },
  // { type: "expand", label: "" },
  {
    prop: "username",
    label: "User Name",
    align: "left",
    search: { el: "input" },
    sortable: false
  },
  {
    prop: "email",
    label: "E-Mail",
    align: "left",
    search: { el: "input" },
    sortable: false
  },
  {
    prop: "created",
    label: "Created",
    width: 200,
    sortable: true,
    search: { el: "date-picker", span: 1, props: { type: "datetimerange" } },
    isShow: true
  },
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
  let json = await getUsersListForExport({
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
const drawerRef = ref<InstanceType<typeof UserDrawer>>();
const openDrawer = async (title: string, rowData?: User.ResGetUserRecord) => {
  let params = {
    title,
    rowData: { ...rowData } as User.ResGetUserRecord,
    isView: title === "View",
    apiUrl:
      title === "New" ? postUserCreate : title === "Edit" ? patchUserUpdate : title === "Stock" ? patchUserUpdate : undefined,
    updateTable: proTable.value!.getTableList
  };
  drawerRef.value!.acceptParams(params);
};

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

  await useHandleData(deleteUsers, { ids }, "Delete the selected user(s)");
  proTable.value.getTableList();
};
</script>
