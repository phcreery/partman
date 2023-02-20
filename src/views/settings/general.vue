<template>
  <div class="card content-box">
    <el-form :model="formData" label-width="140px" style="width: 100%">
      <el-form-item label="Octopart ID :">
        <el-input v-model="formData.id" clearable />
      </el-form-item>
      <el-form-item label="Octopart Secret :">
        <el-input v-model="formData.secret" clearable />
      </el-form-item>
      <!-- <el-form-item label="Test :">
        <el-input v-model="formData.test" clearable />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Save</el-button>
        <el-button @click="getFormData">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="tsx" name="generalSettings">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { ResList, User } from "@/api/interface";
import { CirclePlus, Delete, EditPen, Download, Upload, DCaret } from "@element-plus/icons-vue";
import { getConfig, patchConfigUpdate } from "@/api/modules/components";

// do not use same name with ref
const formData = reactive({
  id: "",
  secret: ""
  // test: ""
});

// Page button permission
const { BUTTONS } = useAuthButtons();

const getFormData = async () => {
  try {
    let { data } = await getConfig({ category: "octopart" });
    Object.assign(formData, data);
  } catch (error) {
    console.error(error);
  }
};

const onSubmit = async () => {
  let data = await patchConfigUpdate({ category: "octopart", value: formData });
  data !== undefined
    ? ElMessage.success("Save Success")
    : ElMessage.error(`Error Saving Settings : octopart - ${JSON.stringify(formData)}`);
};

getFormData();
</script>
