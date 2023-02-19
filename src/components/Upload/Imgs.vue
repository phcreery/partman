<template>
  <div class="upload-box">
    <el-upload
      action="#"
      list-type="picture-card"
      :class="['upload', self_disabled ? 'disabled' : '', drag ? 'no-border' : '']"
      v-model:file-list="fileList"
      :multiple="true"
      :disabled="self_disabled"
      :limit="limit"
      :http-request="handleHttpUpload"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :drag="drag"
      :accept="fileType.join(',')"
    >
      <div class="upload-empty">
        <slot name="empty">
          <el-icon><Plus /></el-icon>
          <!-- <span>Please upload pictures</span> -->
        </slot>
      </div>
      <template #file="{ file }">
        <img :src="file.url" class="upload-image" />
        <div class="upload-handle" @click.stop>
          <div class="handle-icon" @click="handlePictureCardPreview(file)">
            <el-icon><ZoomIn /></el-icon>
            <span>View</span>
          </div>
          <div class="handle-icon" @click="handleRemove(file)" v-if="!self_disabled">
            <el-icon><Delete /></el-icon>
            <span>Delete</span>
          </div>
        </div>
      </template>
    </el-upload>
    <div class="el-upload__tip">
      <slot name="tip"></slot>
    </div>
    <el-image-viewer v-if="imgViewVisible" @close="imgViewVisible = false" :url-list="[viewImageUrl]" />
  </div>
</template>

<script setup lang="ts" name="UploadImgMultiple">
import { ref, computed, inject } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { uploadImg } from "@/api/modules/upload";
import type { UploadProps, UploadFile, UploadUserFile, UploadRequestOptions } from "element-plus";
import { ElNotification, formContextKey, formItemContextKey } from "element-plus";

type FileTypes =
  | "image/apng"
  | "image/bmp"
  | "image/gif"
  | "image/jpeg"
  | "image/pjpeg"
  | "image/png"
  | "image/svg+xml"
  | "image/tiff"
  | "image/webp"
  | "image/x-icon";

interface UploadFileProps {
  fileList: UploadUserFile[];
  api?: (params: any) => Promise<any>; // Uploading images of api Methods，The general project upload is the same api Methods，Just introduce it directly in the component ==> Not a must pass
  drag?: boolean; // Whether to support drag and drop upload ==> Not a must pass（Default is true）
  disabled?: boolean; // Whether to disable the upload component ==> Not a must pass（Default is false）
  limit?: number; // 最大Image Upload数 ==> Not a must pass（Default is 5Zhang）
  fileSize?: number; // Image size limit ==> Not a must pass（Default is 5M）
  fileType?: FileTypes[]; // Image Type Restrictions ==> Not a must pass（Default is ["image/jpeg", "image/png", "image/gif"]）
  height?: string; // Component height ==> Not a must pass（Default is 150px）
  width?: string; // Component width ==> Not a must pass（Default is 150px）
  borderRadius?: string; // Rounded corners of component borders ==> Not a must pass（Default is 8px）
}

const props = withDefaults(defineProps<UploadFileProps>(), {
  fileList: () => [],
  drag: true,
  disabled: false,
  limit: 5,
  fileSize: 5,
  fileType: () => ["image/jpeg", "image/png", "image/gif"],
  height: "150px",
  width: "150px",
  borderRadius: "8px"
});

// Get el-form Component Context
const formContext = inject(formContextKey, void 0);
// Get el-form-item Component Context
const formItemContext = inject(formItemContextKey, void 0);
// Determine if upload and delete are disabled
const self_disabled = computed(() => {
  return props.disabled || formContext?.disabled;
});

const fileList = ref<UploadUserFile[]>(props.fileList);

/**
 * @description Judgment before file upload
 * @param rawFile Uploaded files
 * */
const beforeUpload: UploadProps["beforeUpload"] = rawFile => {
  const imgSize = rawFile.size / 1024 / 1024 < props.fileSize;
  const imgType = props.fileType;
  if (!imgType.includes(rawFile.type as FileTypes))
    ElNotification({
      title: "Notification",
      message: "Uploading images that do not conform to the required format!",
      type: "warning"
    });
  if (!imgSize)
    ElNotification({
      title: "Notification",
      message: `The size of the uploaded image cannot exceed ${props.fileSize}M!`,
      type: "warning"
    });
  return imgType.includes(rawFile.type as FileTypes) && imgSize;
};

/**
 * @description 图片上传
 * @param options Uploaded files
 * */
const handleHttpUpload = async (options: UploadRequestOptions) => {
  let formData = new FormData();
  formData.append("file", options.file);
  try {
    const api = props.api ?? uploadImg;
    const { data } = await api(formData);
    options.onSuccess(data);
  } catch (error) {
    options.onError(error as any);
  }
};

// Image uploaded successfully
interface UploadEmits {
  (e: "update:fileList", value: UploadUserFile[]): void;
}
const emit = defineEmits<UploadEmits>();
const uploadSuccess = (response: { fileUrl: string } | undefined, uploadFile: UploadFile) => {
  if (!response) return;
  uploadFile.url = response.fileUrl;
  emit("update:fileList", fileList.value);
  // Call el-form Internal calibration method（Automatically calibratable）
  formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);
  ElNotification({
    title: "Notification",
    message: "Image uploaded successfully!",
    type: "success"
  });
};

// Delete image
const handleRemove = (uploadFile: UploadFile) => {
  fileList.value = fileList.value.filter(item => item.url !== uploadFile.url || item.name !== uploadFile.name);
  emit("update:fileList", fileList.value);
};

// Image upload error message
const uploadError = () => {
  ElNotification({
    title: "Notification",
    message: "Image upload failed, Please re-upload!",
    type: "error"
  });
};

// File count exceeds prompt
const handleExceed = () => {
  ElNotification({
    title: "Notification",
    message: `Currently, you can only upload a maximum of ${props.limit} Pictures, Please remove and upload!`,
    type: "warning"
  });
};

// Image Preview
const viewImageUrl = ref("");
const imgViewVisible = ref(false);
const handlePictureCardPreview: UploadProps["onPreview"] = uploadFile => {
  viewImageUrl.value = uploadFile.url!;
  imgViewVisible.value = true;
};
</script>

<style scoped lang="scss">
.is-error {
  .upload {
    :deep(.el-upload--picture-card),
    :deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;
      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}
:deep(.disabled) {
  .el-upload--picture-card,
  .el-upload-dragger {
    cursor: not-allowed;
    background: var(--el-disabled-bg-color) !important;
    border: 1px dashed var(--el-border-color-darker);
    &:hover {
      border-color: var(--el-border-color-darker) !important;
    }
  }
}
.upload-box {
  .no-border {
    :deep(.el-upload--picture-card) {
      border: none !important;
    }
  }
  :deep(.upload) {
    .el-upload-dragger {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 0;
      overflow: hidden;
      border: 1px dashed var(--el-border-color-darker);
      border-radius: v-bind(borderRadius);
      &:hover {
        border: 1px dashed var(--el-color-primary);
      }
    }
    .el-upload-dragger.is-dragover {
      background-color: var(--el-color-primary-light-9);
      border: 2px dashed var(--el-color-primary) !important;
    }
    .el-upload-list__item,
    .el-upload--picture-card {
      width: v-bind(width);
      height: v-bind(height);
      background-color: transparent;
      border-radius: v-bind(borderRadius);
    }
    .upload-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .upload-handle {
      position: absolute;
      top: 0;
      right: 0;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      cursor: pointer;
      background: rgb(0 0 0 / 60%);
      opacity: 0;
      transition: var(--el-transition-duration-fast);
      .handle-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 6%;
        color: aliceblue;
        .el-icon {
          margin-bottom: 15%;
          font-size: 140%;
        }
        span {
          font-size: 100%;
        }
      }
    }
    .el-upload-list__item {
      &:hover {
        .upload-handle {
          opacity: 1;
        }
      }
    }
    .upload-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;
      line-height: 30px;
      color: var(--el-color-info);
      .el-icon {
        font-size: 28px;
        color: var(--el-text-color-secondary);
      }
    }
  }
  .el-upload__tip {
    line-height: 15px;
    text-align: center;
  }
}
</style>
