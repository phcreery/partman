<template>
  <el-dialog v-model="dialogVisible" :title="`Batch Add ${parameter.title}`" :destroy-on-close="true" width="580px" draggable>
    <el-form class="drawer-multiColumn-form" label-width="100px">
      <el-form-item label="Template Download:">
        <el-button type="primary" :icon="Download" @click="downloadTemp"> Click to Download </el-button>
      </el-form-item>
      <el-form-item label="File Upload:">
        <el-upload
          action="#"
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
          :accept="parameter.fileType!.join(',')"
        >
          <slot name="empty">
            <el-icon class="el-icon--upload">
              <upload-filled />
            </el-icon>
            <div class="el-upload__text">Drag files here, or <em>click to upload</em></div>
          </slot>
          <template #tip>
            <slot name="tip">
              <div class="el-upload__tip">
                Please upload .xls or .xlsx standard format files, maximum file size is {{ parameter.fileSize }}M
              </div>
            </slot>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="Overwrite Data:">
        <el-switch v-model="isCover" />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
defineOptions({ name: "ImportExcel" });
import { ref } from "vue";
import { useDownload } from "@/hooks/useDownload";
import { Download } from "@element-plus/icons-vue";
import type { UploadRequestOptions, UploadRawFile } from "element-plus";
import { ElNotification } from "element-plus";

export interface ExcelParameterProps {
  title: string; // Title
  fileSize?: number; // Maximum file size
  fileType?: ExcelMimeType[]; // Allowed file types
  tempApi?: (_params: any) => Promise<any>; // Template download API
  importApi?: (_params: any) => Promise<any>; // Batch import API
  getTableList?: () => void; // Fetch table data API
}

// Overwrite data
const isCover = ref(false);
// Maximum number of files to upload
const excelLimit = ref(1);
// Dialog visibility
const dialogVisible = ref(false);
// Parameters from parent component
const parameter = ref<ExcelParameterProps>({
  title: "",
  fileSize: 5,
  fileType: ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
});

// Receive parameters from parent component
const acceptParams = (params: ExcelParameterProps) => {
  parameter.value = { ...parameter.value, ...params };
  dialogVisible.value = true;
};

// Download Excel import template
const downloadTemp = () => {
  if (!parameter.value.tempApi) return;
  useDownload(parameter.value.tempApi, `${parameter.value.title} Template`);
};

// File upload
const uploadExcel = async (param: UploadRequestOptions) => {
  let excelFormData = new FormData();
  excelFormData.append("file", param.file);
  excelFormData.append("isCover", isCover.value as unknown as Blob);
  await parameter.value.importApi!(excelFormData);
  parameter.value.getTableList && parameter.value.getTableList();
  dialogVisible.value = false;
};

/**
 * @description Check before file upload
 * @param file The file to be uploaded
 * */
const beforeExcelUpload = (file: UploadRawFile) => {
  const isExcel = parameter.value.fileType!.includes(file.type as ExcelMimeType);
  const fileSize = file.size / 1024 / 1024 < parameter.value.fileSize!;
  if (!isExcel)
    ElNotification({
      title: "Notice",
      message: "Only xls / xlsx format files can be uploaded!",
      type: "warning"
    });
  if (!fileSize)
    setTimeout(() => {
      ElNotification({
        title: "Notice",
        message: `The uploaded file size cannot exceed ${parameter.value.fileSize}MB!`,
        type: "warning"
      });
    }, 0);
  return isExcel && fileSize;
};

// Exceed file number tip
const handleExceed = () => {
  ElNotification({
    title: "Notice",
    message: "You can only upload one file at most!",
    type: "warning"
  });
};

// Upload error tip
const excelUploadError = () => {
  ElNotification({
    title: "Notice",
    message: `Batch add ${parameter.value.title} failed, please re-upload!`,
    type: "error"
  });
};

// Upload success tip
const excelUploadSuccess = () => {
  ElNotification({
    title: "Notice",
    message: `Batch add ${parameter.value.title} succeeded!`,
    type: "success"
  });
};

defineExpose({
  acceptParams
});
</script>
<style lang="scss" scoped>
@use "./index";
</style>
