<template>
  <el-dialog v-model="dialogVisible" :title="`Batch add ${parameter.title}`" :destroy-on-close="true" width="580px" draggable>
    <el-form class="drawer-multiColumn-form" label-width="150px">
      <el-form-item label="Template :">
        <el-button type="primary" :icon="Download" @click="downloadTemp">Click to download</el-button>
      </el-form-item>
      <el-form-item label="File Upload :">
        <el-upload
          action="string"
          class="upload"
          :drag="true"
          :limit="excelLimit"
          :multiple="true"
          :show-file-list="true"
          :http-request="uploadExcel"
          :before-upload="beforeExcelUpload"
          :on-exceed="handleExceed"
          :on-success="excelUploadSuccess"
          :on-error="excelUploadError"
          accept="text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">Drag the file here, or <em>Click to Upload</em></div>
          <template #tip>
            <div class="el-upload__tip">Supports .csv, .xls, or .xlsx standard format files</div>
          </template>
        </el-upload>
      </el-form-item>
      <!-- <el-form-item label="Data coverage :">
        <el-switch v-model="isCover"> </el-switch>
      </el-form-item> -->
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useDownload } from "@/hooks/useDownload";
import { Download } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";

export interface ExcelParameterProps {
  title: string; // title
  tempApi: (params: any) => Promise<any>; // Download the API of the template
  importApi: (params: any) => Promise<any>; // Batch imported API
  getTableList?: () => Promise<any>; // API of Getting Form Data
}

// Whether to cover data
const isCover = ref(false);
// Maximum file upload number
const excelLimit = ref(1);
// dialog status
const dialogVisible = ref(false);
// Parameters passed by the parent component
const parameter = ref<Partial<ExcelParameterProps>>({});

// Receive parent component parameters
const acceptParams = (params?: any): void => {
  parameter.value = params;
  dialogVisible.value = true;
};

// Excel Import template download
const downloadTemp = () => {
  if (!parameter.value.tempApi) return;
  useDownload(parameter.value.tempApi, `${parameter.value.title}_template`, {}, true, ".csv");
};

// File Upload
const uploadExcel = async (param: any) => {
  let excelFormData = new FormData();
  excelFormData.append("file", param.file);
  excelFormData.append("isCover", isCover.value as unknown as Blob);
  await parameter.value.importApi!(excelFormData);
  parameter.value.getTableList && parameter.value.getTableList();
  dialogVisible.value = false;
};

/**
 * @description Determine before the file upload
 * @param file Uploaded file
 * */
const beforeExcelUpload = (file: any) => {
  const isExcel =
    file.type === "text/csv" ||
    file.type === "application/vnd.ms-excel" ||
    file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isExcel)
    ElNotification({
      title: "Kind tips",
      message: "Upload files can only be csv / xls / xlsx Format!",
      type: "warning"
    });
  if (!isLt5M)
    ElNotification({
      title: "Kind tips",
      message: "The size of the upload file cannot be exceeded 5MB!",
      type: "warning"
    });
  return isExcel && isLt5M;
};

// The number of files exceeds prompts
const handleExceed = (): void => {
  ElNotification({
    title: "Kind tips",
    message: "Only one file can be uploaded at most!",
    type: "warning"
  });
};

// Upload an error prompt
const excelUploadError = (): void => {
  ElNotification({
    title: "Kind tips",
    message: "Import data failed, please upload it again!",
    type: "error"
  });
};

// Upload success prompt
const excelUploadSuccess = (): void => {
  ElNotification({
    title: "Kind tips",
    message: "Import data successfully!",
    type: "success"
  });
};

defineExpose({
  acceptParams
});
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>
