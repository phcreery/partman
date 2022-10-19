<template>
  <div class="card content-box">
    <el-form :model="formData" label-width="140px">
      <el-form-item label="Octopart ID :">
        <el-input v-model="formData.octopart_id" />
      </el-form-item>
      <el-form-item label="Octopart Secret :">
        <el-input v-model="formData.octopart_secret" />
      </el-form-item>
      <el-form-item label="Test :">
        <el-input v-model="formData.test" />
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
import { getConfigList } from "@/api/modules/components";

// If the table needs to initialize the request parameter, it will be directly defined to the protable (each request will automatically bring the parameter every time, and it will always be brought to
const initParam = reactive({});

// do not use same name with ref
const formData = reactive({
  octopart_id: "",
  octopart_secret: "",
  test: ""
});
// const formItems = ref([
//   { id: "octopart_id", name: "ID", value: "" },
//   { id: "octopart_secret", name: "Secret", value: "" },
//   { id: "test", name: "test", value: "" }
// ]);

const onSubmit = () => {
  ElMessage.success("Success : " + JSON.stringify(formData));
};

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
    let { data } = await getConfigList();
    // dataCallBack && (data = dataCallBack(data));
    for (const key in formData) {
      let newItem = data.items.find(record => record.name === key);
      key in formData && newItem ? Object.assign(formData, { [key]: newItem.value }) : null;
    }
    console.log(formData);
  } catch (error) {
    console.log(error);
  }
};

getFormData();
</script>
