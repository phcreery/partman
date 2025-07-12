<template>
  <el-dialog v-model="dialogVisible" title="Change password" width="500px" draggable>
    <!-- <el-row :gutter="20">
      <el-input v-model="oldPassword" type="password" placeholder="Please input old password" show-password />
    </el-row>
    <el-row :gutter="20">
      <el-input v-model="newPassword" type="password" placeholder="Please input new password" show-password />
    </el-row>
    <el-row :gutter="20">
      <el-input v-model="newPasswordConfirm" type="password" placeholder="Please confirm password" show-password />
    </el-row> -->

    <el-form ref="ruleFormRef" :rules="rules" :model="rowData" label-width="130px" label-suffix=" :" :append-to-body="true">
      <el-form-item label="Old Password" prop="oldPassword">
        <el-input v-model="rowData.oldPassword" type="password" placeholder="Please input old password" clearable />
      </el-form-item>
      <el-form-item label="New Password" prop="newPassword">
        <el-input v-model="rowData.newPassword" type="password" placeholder="Please input new password" clearable />
      </el-form-item>
      <el-form-item label="Confirm New Password" prop="newPasswordConfirm">
        <el-input v-model="rowData.newPasswordConfirm" type="password" placeholder="Please confirm new password" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="changePassword">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from "vue";
// import { useGlobalStore } from "@/stores/modules/global";
import { useUserStore } from "@/stores/modules/user";
import { patchUserUpdate } from "@/api/modules/components";
import { ElNotification, FormInstance } from "element-plus";

const dialogVisible = ref(false);
// const oldPassword = ref("");
// const newPassword = ref("");
// const newPasswordConfirm = ref("");
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

const ruleFormRef = ref<FormInstance>();
const rowData = reactive({
  oldPassword: "",
  newPassword: "",
  newPasswordConfirm: ""
});

const rules = reactive({
  oldPassword: [{ required: true, message: "Please enter the old password", trigger: "change" }],
  newPassword: [{ required: true, message: "Please enter the new password", trigger: "change" }],
  newPasswordConfirm: [{ required: true, message: "Please confirm the new password", trigger: "change" }]
});

// const passwordsOkay = computed(() => newPassword.value === newPasswordConfirm.value && newPassword.value.length > 8);
const checkValidate = (val: string) => {
  ruleFormRef.value!.validateField(val, () => {});
};

const changePassword = async () => {
  // Validate form
  await ruleFormRef.value!.validate();
  try {
    const res = await patchUserUpdate({
      ...userInfo.value,
      password: rowData.newPassword,
      passwordConfirm: rowData.newPasswordConfirm,
      oldPassword: rowData.oldPassword
    });
    console.log(res);
    ElNotification({
      title: "Success",
      message: "Password changed successfully",
      type: "success"
    });
    dialogVisible.value = false;
    // Reset form
    rowData.oldPassword = "";
    rowData.newPassword = "";
    rowData.newPasswordConfirm = "";
  } catch (error) {
    console.log(error);
    ElNotification({
      title: "Error",
      message: "Password change error",
      type: "warning"
    });
  }
};

// openDialog
const openDialog = () => {
  dialogVisible.value = true;
};

defineExpose({ openDialog });
</script>
