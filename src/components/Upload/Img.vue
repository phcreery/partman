<template>
  <div class="upload-box">
    <el-upload
      action="#"
      :id="uuid"
      :class="['upload', self_disabled ? 'disabled' : '', drag ? 'no-border' : '']"
      :multiple="false"
      :disabled="self_disabled"
      :show-file-list="false"
      :http-request="handleHttpUpload"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :drag="drag"
      :accept="fileType.join(',')"
    >
      <template v-if="imageName">
        <img :src="imageUrl" class="upload-image" />
        <div class="upload-handle" @click.stop>
          <div class="handle-icon" @click="editImg" v-if="!self_disabled">
            <el-icon><Edit /></el-icon>
            <span>Edit</span>
          </div>
          <div class="handle-icon" @click="imgViewVisible = true">
            <el-icon><ZoomIn /></el-icon>
            <span>View</span>
          </div>
          <div class="handle-icon" @click="deleteImg" v-if="!self_disabled">
            <el-icon><Delete /></el-icon>
            <span>Delete</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="upload-empty">
          <slot name="empty">
            <el-icon><Plus /></el-icon>
            <!-- <span>Please upload pictures</span> -->
          </slot>
        </div>
      </template>
    </el-upload>
    <div class="el-upload__tip">
      <slot name="tip"></slot>
    </div>
    <el-image-viewer v-if="imgViewVisible" @close="imgViewVisible = false" :url-list="[imageUrl]" />
  </div>
</template>

<script setup lang="ts" name="UploadImg">
import { ref, computed, inject } from "vue";
import { uploadImg } from "@/api/modules/upload";
import { generateUUID } from "@/utils/util";
import { ElNotification, formContextKey, formItemContextKey } from "element-plus";
import type { UploadProps, UploadRequestOptions } from "element-plus";

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
  imageName: string; // Image address ==> Must Pass
  imageUrl: string;
  rowParam: string;
  api?: (params: any) => Promise<any>; // Uploading images of api Method，The general project upload is the same api Methods，Just introduce it directly in the component ==> Not a must pass
  drag?: boolean; // Whether to support drag and drop upload ==> Not a must pass（Default is true）
  disabled?: boolean; // Whether to disable the upload component ==> Not a must pass（Default is false）
  fileSize?: number; // Image size limit ==> Not a must pass（Default is 5M）
  fileType?: FileTypes[]; // Image Type Restrictions ==> Not a must pass（Default is ["image/jpeg", "image/png", "image/gif"]）
  height?: string; // Component height ==> Not a must pass（Default is 150px）
  width?: string; // Component width ==> Not a must pass（Default is 150px）
  borderRadius?: string; // Rounded corners of component borders ==> Not a must pass（Default is 8px）
}

// Accept parent component parameters
const props = withDefaults(defineProps<UploadFileProps>(), {
  imageName: "",
  imageUrl: "",
  rowParam: "",
  drag: true,
  disabled: false,
  fileSize: 5,
  fileType: () => ["image/jpeg", "image/png", "image/gif"],
  height: "150px",
  width: "150px",
  borderRadius: "8px"
});

// Generate component uniqueid
const uuid = ref("id-" + generateUUID());

// View Image
const imgViewVisible = ref(false);
// Get el-form Component Context
const formContext = inject(formContextKey, void 0);
// Get el-form-item Component Context
const formItemContext = inject(formItemContextKey, void 0);
// Determine if upload and delete are disabled
const self_disabled = computed(() => {
  return props.disabled || formContext?.disabled;
});

/**
 * @description Image Upload
 * @param options Uploaded files
 * */
interface UploadEmits {
  (e: "update:imageName", value: string): void;
  (e: "check-validate"): void;
}
const emit = defineEmits<UploadEmits>();
const handleHttpUpload = async (options: UploadRequestOptions) => {
  let formData = new FormData();
  formData.append(props.rowParam ?? "file", options.file);
  try {
    const api = props.api ?? uploadImg;
    const { data } = await api(formData);
    console.log("upload data", formData, data);
    // emit("update:imageUrl", data.fileUrl);
    // emit("update:imageName", options.file.name);
    emit("update:imageName", data[props.rowParam ?? "file"]);
    // Call el-form Internal calibration method（Automatically calibratable）
    formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);
    emit("check-validate");
  } catch (error) {
    options.onError(error as any);
  }
};

/**
 * @description Delete image
 * */
const deleteImg = async () => {
  const api = props.api ?? uploadImg;
  let formData = new FormData();
  formData.append(props.rowParam ?? "file", "");
  await api(formData);
  emit("update:imageName", "");
};

/**
 * @description Edited images
 * */
const editImg = () => {
  const dom = document.querySelector(`#${uuid.value} .el-upload__input`);
  dom && dom.dispatchEvent(new MouseEvent("click"));
};

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
      message: "Uploading images that do not conform to the required format！",
      type: "warning"
    });
  if (!imgSize)
    ElNotification({
      title: "Notification",
      message: `The size of the uploaded image cannot exceed ${props.fileSize}M！`,
      type: "warning"
    });
  return imgType.includes(rawFile.type as FileTypes) && imgSize;
};

// Image upload success prompt
const uploadSuccess = () => {
  ElNotification({
    title: "Notification",
    message: "Image uploaded successfully！",
    type: "success"
  });
};

// Image upload error message
const uploadError = () => {
  ElNotification({
    title: "Notification",
    message: "Image upload failed，Please re-upload！",
    type: "error"
  });
};
</script>
<style scoped lang="scss">
.is-error {
  .upload {
    :deep(.el-upload),
    :deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;
      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}
:deep(.disabled) {
  .el-upload,
  .el-upload-dragger {
    cursor: not-allowed !important;
    background: var(--el-disabled-bg-color);
    border: 1px dashed var(--el-border-color-darker) !important;
    &:hover {
      border: 1px dashed var(--el-border-color-darker) !important;
    }
  }
}
.upload-box {
  .no-border {
    :deep(.el-upload) {
      border: none !important;
    }
  }
  :deep(.upload) {
    .el-upload {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: v-bind(width);
      height: v-bind(height);
      overflow: hidden;
      border: 1px dashed var(--el-border-color-darker);
      border-radius: v-bind(borderRadius);
      transition: var(--el-transition-duration-fast);
      &:hover {
        border-color: var(--el-color-primary);
        .upload-handle {
          opacity: 1;
        }
      }
      .el-upload-dragger {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 0;
        overflow: hidden;
        background-color: transparent;
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
      .upload-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .upload-empty {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        line-height: 30px;
        color: var(--el-color-info);
        .el-icon {
          font-size: 28px;
          color: var(--el-text-color-secondary);
        }
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
            margin-bottom: 40%;
            font-size: 130%;
            line-height: 130%;
          }
          span {
            font-size: 85%;
            line-height: 85%;
          }
        }
      }
    }
  }
  .el-upload__tip {
    line-height: 18px;
    text-align: center;
  }
}
</style>
