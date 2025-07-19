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
        <el-button type="primary" :icon="CirclePlus" @click="postBackupCreate()" v-if="BUTTONS.add"> New Backup </el-button>
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
        <!-- <el-button :icon="Download" plain @click="downloadFile" v-if="BUTTONS.export">Export</el-button> -->
        <el-button :icon="Upload" plain @click="uploadFile" v-if="BUTTONS.import">Upload</el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        <!-- {{ scope.row }} -->
      </template>
      <!-- Table operation -->
      <template #operation="scope">
        <el-button
          type="primary"
          link
          :icon="FolderOpened"
          @click="postBackupRestore({ key: scope.row.key })"
          v-if="BUTTONS.restore"
        >
          Restore
        </el-button>
        <el-button type="primary" link :icon="Download" @click="downloadFile(scope.row.key)" v-if="BUTTONS.export">
          Download
        </el-button>
      </template>
    </ProTable>
  </div>
  <UploadBackup ref="dialogRefUpload"></UploadBackup>
</template>

<script setup lang="tsx" name="logs">
import { ref, reactive } from "vue";
import { ZoomIn, Download, CirclePlus, EditPen, Delete, FolderOpened, Upload } from "@element-plus/icons-vue";

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
    width: 200,
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
  // ElNotification({
  //   title: "Notification",
  //   message: "This feature is not implemented yet.",
  //   type: "warning"
  // });
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
</script>
