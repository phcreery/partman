<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      pageAuthId="backups"
      rowKey="key"
      :columns="columns"
      :requestApi="getBackupsList"
      :initParam="initParam"
      :isPageable="true"
      :dataCallback="dataCallback"
    >
      <!-- Table header button -->
      <template #tableHeader="scope">
        <el-button type="primary" :icon="CirclePlus" @click="createBackup()" v-if="BUTTONS.add"> New Backup </el-button>
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
        <el-button :icon="Upload" plain @click="uploadFile" v-if="BUTTONS.import">Upload</el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        <!-- {{ scope.row }} -->
      </template>
      <!-- Table operation -->
      <template #operation="scope">
        <el-dropdown trigger="click">
          <el-button type="primary" link :icon="ArrowDown"> Options </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :icon="Download" @click="downloadFile(scope.row.key)" v-if="BUTTONS.export">
                Download
              </el-dropdown-item>
              <el-dropdown-item :icon="FolderOpened" @click="restoreBackup({ key: scope.row.key })" v-if="BUTTONS.restore">
                Restore
              </el-dropdown-item>
              <el-dropdown-item :icon="Delete" @click="batchDelete([scope.row.key])" v-if="BUTTONS.batchDelete" divided>
                Delete
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </ProTable>
  </div>
  <UploadBackup ref="dialogRefUpload"></UploadBackup>
</template>

<script setup lang="tsx" name="logs">
import { ref, reactive } from "vue";
import { ZoomIn, Download, CirclePlus, EditPen, Delete, FolderOpened, Upload, ArrowDown } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage } from "element-plus";

// Components
import { ColumnProps, PageableList } from "@/components/ProTable/interface/index";
import ProTable from "@/components/ProTable/index.vue";

// Backup components
import UploadBackup from "./components/UploadBackup.vue";

// Hooks
import { useAuthButtons } from "@/hooks/useAuthButtons";

// API
import {
  getBackupsList,
  postBackupCreate,
  deleteBackup,
  deleteBackups,
  postBackupRestore,
  getBackupDownloadURL,
  postBackupUpload
} from "@/api/modules/components";
import { logoutApi } from "@/api/modules/login";
import type { Backup, ListResult } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { ElNotification } from "element-plus";

// Get the ProTable element and call it to get the refresh data method (you can also get the current query parameter, so that it is convenient for exporting and carrying parameters)
const proTable = ref<InstanceType<typeof ProTable>>();

// If the table needs to initialize the request parameter, it will be directly defined to the propable (each request will automatically bring the parameter every time, and it will always be brought to
const initParam = reactive({});

// DataCallBack is processed to the returned table data. If the data returned in the background is not DataList && Total && PAGENUM && PageSize, then you can process these fields here.
const dataCallback = (data: ListResult<Backup.ResGetBackupRecord>): PageableList<Backup.ResGetBackupRecord> => {
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
const columns: Partial<ColumnProps<Backup.ResGetBackupRecord>>[] = [
  { type: "selection", width: 40, fixed: "left" },
  {
    prop: "key",
    label: "Key",
    align: "left",
    search: { el: "input" },
    sortable: false
  },
  {
    prop: "modified",
    label: "Modified",
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
const downloadFile = async (id: string) => {
  const URL = await getBackupDownloadURL({ key: id });
  window && window.open(URL)!.focus();
};

const dialogRefUpload = ref<InstanceType<typeof UploadBackup>>();
const uploadFile = () => {
  if (!proTable.value) {
    console.error("ProTable is not initialized");
    return;
  }
  let params = {
    title: "Backups",
    apiUpload: postBackupUpload,
    refresh: proTable.value.getTableList
  };
  dialogRefUpload.value!.acceptParams(params);
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

  await useHandleData(deleteBackups, { keys: ids }, "Delete the selected backup(s)");
  proTable.value.getTableList();
  proTable.value.clearSelection();
};

const createBackup = async () => {
  if (!proTable.value) {
    console.error("ProTable is not initialized");
    return;
  }

  await postBackupCreate();
  proTable.value.getTableList();
  proTable.value.clearSelection();
};

const restoreBackup = async (params: { key: string }) => {
  if (!proTable.value) {
    return;
  }

  ElMessageBox.confirm(`This will restore all user information and log out the current logged in user?`, "Prompt", {
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    type: "warning",
    draggable: true
  }).then(async () => {
    await useHandleData(postBackupRestore, params, "restore to the selected backup");
    console.log("Backup restored, logging out...");
    logoutApi();
  });
};
</script>
