<template>
  <el-form :model="octopartFormData" label-width="140px" style="width: 100%">
    <el-form-item label="Octopart ID :">
      <el-input v-model="octopartFormData.id" clearable style="width: 300px" />
    </el-form-item>
    <el-form-item label="Octopart Secret :">
      <el-input v-model="octopartFormData.secret" clearable style="width: 300px" type="password" show-password />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Save</el-button>
      <el-button @click="getOctopartFormData">Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="tsx" name="generalSettings">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getConfig, patchConfigUpdate } from "@/api/modules/components";

// do not use same name with ref
const octopartFormData = reactive({
  id: "",
  secret: ""
});

const getOctopartFormData = async () => {
  try {
    let data = await getConfig({ category: "octopart" });
    Object.assign(octopartFormData, data);
  } catch (error) {
    console.error(error);
  }
};

const onSubmit = async () => {
  let data = await patchConfigUpdate({ category: "octopart", value: octopartFormData });
  data !== undefined
    ? ElMessage.success("Save Success")
    : ElMessage.error(`Error Saving Settings : octopart - ${JSON.stringify(octopartFormData)}`);
};

onMounted(() => {
  console.log("mounted");
  getOctopartFormData();
});
</script>
