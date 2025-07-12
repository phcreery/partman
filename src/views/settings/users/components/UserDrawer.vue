<template>
  <div>
    <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerData.title} Component`">
      <el-form
        ref="ruleFormRef"
        :rules="rules"
        :disabled="drawerData.isView"
        :model="drawerData.rowData"
        label-width="130px"
        label-suffix=" :"
        :append-to-body="true"
      >
        <el-form-item label="E-Mail" prop="email">
          <el-input v-model="drawerData.rowData!.email" placeholder="Please fill in the user email" clearable autosize>
          </el-input>
        </el-form-item>
        <el-form-item label="Username" prop="username">
          <el-input v-model="drawerData.rowData!.username" placeholder="Please fill in the username" clearable autosize>
          </el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input
            v-model="drawerData.rowData!.password"
            type="password"
            placeholder="Please fill in the user password"
            clearable
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

<script setup lang="ts" name="ComponentDrawer">
import { ref, reactive, watch } from "vue";
import { ElMessage, FormInstance } from "element-plus";

// API
import { User } from "@/api/interface";

const rules = reactive({
  username: [{ required: true, message: "Please enter the username", trigger: "change" }],
  email: [{ required: true, message: "Please enter the email", trigger: "change" }],
  password: [{ required: true, message: "Please enter the password", trigger: "change" }]
});

export interface DrawerProps {
  title: string;
  isView: boolean;
  rowData: User.ResGetUserRecord;
  apiUrl?: (params: any, id?: string) => Promise<any>;
  updateTable?: () => Promise<any>;
}

// drawer frame status
const drawerVisible = ref(false);
const drawerData = ref<DrawerProps>({
  isView: false,
  title: "",
  rowData: {} as User.ResGetUserRecord
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
