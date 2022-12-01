<template>
  <div>
    <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerData.title} Component`">
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
        <!-- <el-form-item label="profile picture" prop="avatar">
        <UploadImg
          v-model:imageUrl="drawerData.rowData!.avatar"
          :disabled="drawerData.isView"
          :upload-style="{ width: '120px', height: '120px' }"
          @check-validate="checkValidate('avatar')"
        >
          <template #tip> The size cannot exceed 3M </template>
        </UploadImg>
      </el-form-item> -->
        <el-form-item label="Name" prop="name">
          <el-input
            v-model="drawerData.rowData!.name"
            placeholder="Please fill in the user name"
            clearable
            :rows="4"
            type="textarea"
            autosize
          >
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="Description" prop="description">
          <el-input
            v-model="drawerData.rowData!.description"
            placeholder="Please fill in the component description"
            clearable
            :rows="4"
            type="textarea"
            autosize
          >
          </el-input>
        </el-form-item> -->
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
import { Refresh, Plus, Search, Delete } from "@element-plus/icons-vue";
import { ElMessage, FormInstance } from "element-plus";
// import { genderType } from "@/utils/serviceDict";
import { User } from "@/api/interface";
// import { getFootprintsEnum } from "@/api/modules/components";
import { nestedObjectAssign } from "@/utils/util";
// import UploadImg from "@/components/UploadImg/index.vue";

const rules = reactive({
  name: [{ required: true, message: "Please upload the component name", trigger: "change" }]
});

// const cascaderProps = { value: "id", label: "name", emitPath: false };
const treeSelectProps = { value: "id", label: "name", emitPath: false };

interface DrawerProps {
  title: string;
  isView: boolean;
  rowData?: User.ResGetUserRecord;
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

const importRowData = (rowData: User.ResGetUserRecord) => {
  nestedObjectAssign(drawerData.value.rowData, rowData);
  // drawerData.value.rowData = rowData;
};

const ruleFormRef = ref<FormInstance>();
// Submit data (new/edit)
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerData.value.apiUrl!(drawerData.value.rowData);
      ElMessage.success({ message: `${drawerData.value.title} component success!` });
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

defineExpose({
  acceptParams
});
</script>

<style lang="scss"></style>
