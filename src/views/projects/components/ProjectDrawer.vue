<template>
  <div>
    <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerData.title} Project`">
      <!-- Drawer Data: {{ drawerData.rowData }} -->
      <el-form
        ref="ruleFormRef"
        :rules="rules"
        :disabled="drawerData.isView"
        :model="drawerData.rowData"
        label-width="130px"
        label-suffix=" :"
        :append-to-body="true"
      >
        <el-form-item label="Name" prop="name">
          <el-input
            v-model="drawerData.rowData!.name"
            placeholder="Please fill in the project"
            clearable
            :rows="4"
            type="textarea"
            autosize
          >
          </el-input>
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input
            v-model="drawerData.rowData!.description"
            placeholder="Please fill in the project description"
            clearable
            :rows="4"
            type="textarea"
            autosize
          >
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="drawerVisible = false">Cancel</el-button>
        <el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">Save</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive, watch } from "vue";
// import { Refresh, Plus, Search, Delete } from "@element-plus/icons-vue";
import { ElMessage, FormInstance } from "element-plus";
// import { genderType } from "@/utils/serviceDict";
import { Project } from "@/api/interface";
// import UploadImg from "@/components/UploadImg/index.vue";

const rules = reactive({
  name: [{ required: true, message: "Please enter the project name", trigger: "change" }],
  description: [{ required: false, message: "Please enter project description", trigger: "change" }]
});

// const cascaderProps = { value: "id", label: "name", emitPath: false };
// const treeSelectProps = { value: "id", label: "name", emitPath: false };

interface DrawerProps {
  title: string;
  isView: boolean;
  rowData?: Project.ResGetProjectRecord;
  apiUrl?: (params: any) => Promise<any>;
  updateTable?: () => Promise<any>;
}

// drawer frame status
const drawerVisible = ref(false);
const drawerData = ref<DrawerProps>({
  isView: false,
  title: ""
});

// Parameters transmitted from the parent component
const acceptParams = (params: DrawerProps): void => {
  drawerData.value = params;
  drawerVisible.value = true;
};

const ruleFormRef = ref<FormInstance>();
// Submit data (new/edit)
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerData.value.apiUrl!(drawerData.value.rowData);
      ElMessage.success({ message: `${drawerData.value.title} project success!` });
      drawerData.value.updateTable!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

// Public verification method (the picture upload successfully triggers re -verification)
// const checkValidate = (val: string) => {
// 	ruleFormRef.value!.validateField(val, () => {});
// };

// TreeSelect search function
// const filterNodeMethod = (value: string, data: ProjectCategory.ResGetProjectCategoryRecord) => {
// 	return data.name.toLowerCase().includes(value.toLowerCase());
// };

// When opening the drawer, fetch the necessary field values
watch(drawerVisible, openValue => {
  if (openValue) {
  }
});

defineExpose({
  acceptParams
});
</script>

<style lang="scss"></style>
