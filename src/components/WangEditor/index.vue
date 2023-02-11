<template>
  <div :class="['editor-box', disabled ? 'editor-disabled' : '']">
    <Toolbar class="editor-toolbar" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" v-if="!hideToolBar" />
    <Editor
      :style="{ height }"
      class="editor-content'"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @on-created="handleCreated"
      @on-blur="handleBlur"
    />
  </div>
</template>

<script setup lang="ts" name="WangEditor">
import { nextTick, computed, shallowRef, onBeforeUnmount } from "vue";
import { IToolbarConfig, IEditorConfig } from "@wangeditor/editor";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { uploadImg, uploadVideo } from "@/api/modules/upload";
import "@wangeditor/editor/dist/css/style.css";

// Rich Text DOM Element
const editorRef = shallowRef();

// Realization Editor
const handleCreated = (editor: any) => {
  editorRef.value = editor;
};

// Receive parent component parameters，and set the default value
interface RichEditorProps {
  value: string; // Rich text values ==> Must Pass
  toolbarConfig?: Partial<IToolbarConfig>; // Toolbar configuration ==> Not a must pass（Default is空）
  editorConfig?: Partial<IEditorConfig>; // Editor Configuration ==> Not a must pass（Default is空）
  height?: string; // Rich Text Height ==> Not a must pass（Default is 500px）
  mode?: "default" | "simple"; // Rich text mode ==> Not a must pass（Default is default）
  hideToolBar?: boolean; // Whether to hide the toolbar ==> Not a must pass（默认为false）
  disabled?: boolean; // Whether to disable the editor ==> Not a must pass（默认为false）
}
const props = withDefaults(defineProps<RichEditorProps>(), {
  toolbarConfig: () => {
    return {
      excludeKeys: []
    };
  },
  editorConfig: () => {
    return {
      placeholder: "Please enter content...",
      MENU_CONF: {}
    };
  },
  height: "500px",
  mode: "default",
  hideToolBar: false,
  disabled: false
});

// Determine if the current rich text editor is disabled
if (props.disabled) nextTick(() => editorRef.value.disable());

// Rich Text Content Listening，Trigger parent component change，Implementing two-way data binding
type EmitProps = {
  (e: "update:value", val: string): void;
  (e: "check-validate"): void;
};
const emit = defineEmits<EmitProps>();
const valueHtml = computed({
  get() {
    return props.value;
  },
  set(val: string) {
    // Prevent rich text content from being empty when，Calibration failure
    if (editorRef.value.isEmpty()) val = "";
    emit("update:value", val);
  }
});

/**
 * @description Image custom upload
 * @param file Uploaded files
 * @param insertFn Callback function after successful upload（Insert into the rich text editor）
 * */
type InsertFnTypeImg = (url: string, alt?: string, href?: string) => void;
props.editorConfig.MENU_CONF!["uploadImage"] = {
  async customUpload(file: File, insertFn: InsertFnTypeImg) {
    if (!uploadImgValidate(file)) return;
    let formData = new FormData();
    formData.append("file", file);
    try {
      const { data } = await uploadImg(formData);
      insertFn(data.fileUrl);
    } catch (error) {
      console.log(error);
    }
  }
};

// Judgment before image upload
const uploadImgValidate = (file: File): boolean => {
  console.log(file);
  return true;
};

/**
 * @description Video Custom Upload
 * @param file Uploaded files
 * @param insertFn Callback function after successful upload（Insert into the rich text editor）
 * */
type InsertFnTypeVideo = (url: string, poster?: string) => void;
props.editorConfig.MENU_CONF!["uploadVideo"] = {
  async customUpload(file: File, insertFn: InsertFnTypeVideo) {
    if (!uploadVideoValidate(file)) return;
    let formData = new FormData();
    formData.append("file", file);
    try {
      const { data } = await uploadVideo(formData);
      insertFn(data.fileUrl);
    } catch (error) {
      console.log(error);
    }
  }
};

// Judgment before video upload
const uploadVideoValidate = (file: File): boolean => {
  console.log(file);
  return true;
};

// Triggered when the edit box loses focus
const handleBlur = () => {
  emit("check-validate");
};

// When a component is destroyed，Also destroy the editor in time
onBeforeUnmount(() => {
  if (!editorRef.value) return;
  editorRef.value.destroy();
});

defineExpose({
  editor: editorRef
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
