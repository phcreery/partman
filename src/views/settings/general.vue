<template>
  <div class="card content-box">
    <el-form :model="formData" label-width="140px" style="width: 100%">
      <el-form-item label="Octopart ID :">
        <el-input v-model="formData.id" clearable />
      </el-form-item>
      <el-form-item label="Octopart Secret :">
        <el-input v-model="formData.secret" clearable />
      </el-form-item>
      <el-form-item label="Test :">
        <el-input v-model="formData.test" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Save</el-button>
        <!-- <el-button>Cancel</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="tsx" name="useComponent">
import { ref, reactive, toRefs } from "vue";
import { ElMessage } from "element-plus";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { ResList, User } from "@/api/interface";
import { CirclePlus, Delete, EditPen, Download, Upload, DCaret } from "@element-plus/icons-vue";
import { getConfig, patchConfigUpdate } from "@/api/modules/components";

// If the table needs to initialize the request parameter, it will be directly defined to the protable (each request will automatically bring the parameter every time, and it will always be brought to
const initParam = reactive({});

// do not use same name with ref
const formData = reactive({
  id: "",
  secret: "",
  test: ""
});

// DataCallBack is processed to the returned table data. If the data returned in the background is not DataList && Total && PAGENUM && PageSize, then you can process these fields here.
const dataCallback = (data: ResList<User.ResGetUserRecord>) => {
  return {
    datalist: data.items,
    total: data.totalItems,
    pageNum: data.page,
    pageSize: data.perPage
  };
};
// Page button permission
const { BUTTONS } = useAuthButtons();

const getFormData = async () => {
  try {
    let { data } = await getConfig({ category: "octopart" });
    Object.assign(formData, data);
  } catch (error) {
    console.log(error);
  }
};

const onSubmit = async () => {
  let data = await patchConfigUpdate({ category: "octopart", value: formData });
  console.log(data);
  data !== undefined
    ? ElMessage.success("Save Success")
    : ElMessage.error(`Error Saving Settings : octopart- ${JSON.stringify(formData)}`);
};

getFormData();
</script>
