<template>
  <el-dialog v-model="dialogVisible" title="Change password" width="500px" draggable>
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
import { useUserStore } from "@/stores/modules/user";
import { patchUserUpdate } from "@/api/modules/components";
import { ElNotification, FormInstance } from "element-plus";
import router from "@/routers";

const dialogVisible = ref(false);
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

const changePassword = async () => {
  // Validate form
  try {
    await ruleFormRef.value!.validate();
    const res = await patchUserUpdate({
      ...userInfo.value,
      password: rowData.newPassword,
      passwordConfirm: rowData.newPasswordConfirm,
      oldPassword: rowData.oldPassword
    });
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

    // logout
    userStore.setToken("");
    router.replace({
      path: "/login"
    });
  } catch (error) {
    console.error(error);
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
