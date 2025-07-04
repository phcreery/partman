<template>
  <el-dialog v-model="dialogVisible" title="Change password" width="500px" draggable>
    <el-row :gutter="20">
      <!-- <span>Old Password</span> -->
      <el-input v-model="oldPassword" type="password" placeholder="Please input old password" show-password />
    </el-row>
    <el-row :gutter="20">
      <!-- <span>Enter New Password</span> -->
      <el-input v-model="newPassword" type="password" placeholder="Please input new password" show-password />
    </el-row>
    <el-row :gutter="20">
      <!-- <span>Confirm Password</span> -->
      <el-input v-model="newPasswordConfirm" type="password" placeholder="Please confirm password" show-password />
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="changePassword" :disabled="!passwordsOkay">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useGlobalStore } from "@/stores/modules/global";
import { useUserStore } from "@/stores/modules/user";
import { patchUserUpdate } from "@/api/modules/components";
import { ElNotification } from "element-plus";

const dialogVisible = ref(false);
const oldPassword = ref("");
const newPassword = ref("");
const newPasswordConfirm = ref("");
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

const passwordsOkay = computed(() => newPassword.value === newPasswordConfirm.value && newPassword.value.length > 8);

const changePassword = async () => {
  if (newPassword.value !== newPasswordConfirm.value) {
    console.log("password not changed");
    return;
  }
  console.log("userinfo", userInfo.value);
  try {
    const res = await patchUserUpdate({
      ...userInfo.value,
      password: newPassword.value,
      passwordConfirm: newPasswordConfirm.value,
      oldPassword: oldPassword.value
    });
    console.log(res);
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
