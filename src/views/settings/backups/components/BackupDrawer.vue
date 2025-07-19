<template>
  <div>
    <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerData.title} Backup`">
      <el-form
        ref="ruleFormRef"
        :rules="rules"
        :disabled="drawerData.isView"
        :model="drawerData.rowData"
        label-width="130px"
        label-suffix=" :"
        :append-to-body="true"
      >
        <el-form-item label="E-Mail" prop="name">
          <el-input v-model="drawerData.rowData!.name" placeholder="Please fill in the name" clearable autosize> </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="drawerVisible = false">Cancel</el-button>
        <el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">Save</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="BackupDrawer">
import { ref, reactive, watch } from "vue";
import { ElMessage, FormInstance } from "element-plus";

// API
import { Backup } from "@/api/interface";

const rules = reactive({
  name: [{ required: true, message: "Please enter the name", trigger: "change" }]
});

export interface DrawerProps {
  title: string;
  isView: boolean;
  rowData: Backup.ResGetBackupRecord;
  apiUrl?: (params: any, id?: string) => Promise<any>;
  updateTable?: () => Promise<any>;
}

// drawer frame status
const drawerVisible = ref(false);
const drawerData = ref<DrawerProps>({
  isView: false,
  title: "",
  rowData: {} as Backup.ResGetBackupRecord
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
      ElMessage.success({ message: `${drawerData.value.title} component success!` });
      drawerData.value.updateTable!();
      drawerVisible.value = false;
    } catch (error) {
      console.error(error);
    }
  });
};

// Public verification method (the picture upload successfully triggers re -verification)
const checkValidate = (val: string) => {
  ruleFormRef.value!.validateField(val, () => {});
};

// TreeSelect search function
// const filterNodeMethod = (value: string, data: User.ResGetUserRecord) => {
//   return data.name.toLowerCase().includes(value.toLowerCase());
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

<style lang="scss">
.form-item-with-buttons {
  width: 100%;
  .el-space {
    width: 100%;
    .el-space__item {
      &:first-child {
        width: 100%;
      }
      &:last-child {
        margin-right: 0 !important;
      }
      & > .el-button-group {
        width: max-content;
      }
    }
  }
}
</style>
