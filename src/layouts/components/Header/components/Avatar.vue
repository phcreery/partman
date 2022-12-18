<template>
  <el-dropdown trigger="click">
    <div class="avatar isicon">
      <img src="@/assets/images/avatar.gif" alt="avatar" />
      <!-- <el-icon><Avatar /></el-icon> -->
      <!-- <Avatar /> -->
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="openDialog('infoRef')">
          <el-icon><User /></el-icon>{{ $t("header.personalData") }}
        </el-dropdown-item>
        <el-dropdown-item @click="openDialog('passwordRef')">
          <el-icon><Edit /></el-icon>{{ $t("header.changePassword") }}
        </el-dropdown-item>
        <el-dropdown-item @click="logout" divided>
          <el-icon><SwitchButton /></el-icon>{{ $t("header.logout") }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <!-- infoDialog -->
  <InfoDialog ref="infoRef"></InfoDialog>
  <!-- passwordDialog -->
  <PasswordDialog ref="passwordRef"></PasswordDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { GlobalStore } from "@/stores";
import { LOGIN_URL } from "@/config/config";
import { resetRouter } from "@/routers/index";
import { logoutApi } from "@/api/modules/login";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import InfoDialog from "./InfoDialog.vue";
import PasswordDialog from "./PasswordDialog.vue";

const router = useRouter();
const globalStore = GlobalStore();

// Logout
const logout = () => {
  ElMessageBox.confirm("Are you sure you want to log out??", "Warm Tips", {
    confirmButtonText: "Determine",
    cancelButtonText: "Cancellation",
    type: "warning"
  }).then(async () => {
    // 1.Calling the logout interface
    await logoutApi();
    // 2.Clear Token
    globalStore.setToken("");
    // 3.Re-routing
    resetRouter();
    // 4.Redirect to landing page
    router.replace(LOGIN_URL);
    ElMessage.success("Log out successfully！");
  });
};

interface DialogExpose {
  openDialog: () => void;
}
const infoRef = ref<null | DialogExpose>(null);
const passwordRef = ref<null | DialogExpose>(null);
// Open the change password and personal information pop-up window
const openDialog = (refName: string) => {
  if (refName == "infoRef") infoRef.value?.openDialog();
  else passwordRef.value?.openDialog();
};
</script>

<style scoped lang="scss">
.avatar {
  width: 40px;
  height: 40px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 50%;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
