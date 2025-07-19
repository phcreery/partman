<template>
  <el-dialog v-model="dialogVisible" :title="`Upload ${props.title}`" :destroy-on-close="true" draggable>
    <el-row justify="center">
      <el-col :span="24">
        <el-upload
          action="string"
          class="upload"
          :drag="true"
          :limit="1"
          :multiple="true"
          :show-file-list="true"
          :http-request="handleApiUpload"
          :before-upload="beforeZipUpload"
          :on-exceed="handleExceed"
          :on-success="zipUploadSuccess"
          :on-error="zipUploadError"
          accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
        >
          <el-icon><upload-filled /></el-icon>
          <div>Drag the file here, or <em>Click to upload</em></div>
          <template #tip>
            <div>Please upload .zip</div>
          </template>
        </el-upload>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script setup lang="ts" name="ImportExcel">
import { ref, reactive, toRef, watch, computed } from "vue";
import { Download, Upload, View } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
import type { UploadRequestOptions } from "element-plus";

export interface DrawerProps {
  title: string; // Title
  apiUpload: (params: any) => Promise<any>;
  refresh?: () => Promise<any>; // Get table data forApi
}

// dialogStatus
const dialogVisible = ref(false);
// Parameters passed from the parent component
const props = ref<Partial<DrawerProps>>({});

// Receive parent component parameters
const acceptParams = (params?: any): void => {
  props.value = params;
  dialogVisible.value = true;
};

/**
 * @description Judgment before file upload
 * @param file Uploaded files
 * */
const beforeZipUpload = (file: any) => {
  const isZip =
    file.type === "application/zip" ||
    file.type === "application/x-zip-compressed" ||
    file.type === "application/octet-stream" ||
    file.type === "application/x-zip" ||
    file.type === "zip";
  // const fileName = file.name.endsWith(".zip");
  const fileSize = file.size / 1024 / 1024 < 5;
  if (!isZip)
    ElNotification({
      title: "Notification",
      message: "Upload files can only be zip!",
      type: "warning"
    });
  if (!fileSize)
    ElNotification({
      title: "Notification",
      message: "Upload file size cannot exceed 5MB!",
      type: "warning"
    });
  return isZip && fileSize;
};

// File count exceeds prompt
const handleExceed = (): void => {
  ElNotification({
    title: "Notification",
    message: "Maximum of one file upload!",
    type: "warning"
  });
};

// Upload error message
const zipUploadError = (): void => {
  ElNotification({
    title: "Notification",
    message: `Add ${props.value.title} Failure, Please re-upload!`,
    type: "error"
  });
};

// 上传Success提示
const zipUploadSuccess = (): void => {
  ElNotification({
    title: "Notification",
    message: `Add ${props.value.title} success!`,
    type: "success"
  });
  props.value.refresh && props.value.refresh();
  dialogVisible.value = false;
};

const handleApiUpload = (req: UploadRequestOptions): Promise<any> => {
  if (!props.value.apiUpload) {
    console.error("API upload function is not defined");
    return Promise.reject(new Error("API upload function is not defined"));
  }
  return props.value.apiUpload({ file: req.file });
};

defineExpose({
  acceptParams
});
</script>
<style lang="scss" scoped>
// @use "./index";
</style>
