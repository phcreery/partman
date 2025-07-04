<template>
  <el-dropdown trigger="click">
    <!-- <div class="avatar">
      <img src="@/assets/images/avatar.gif" alt="avatar" />
    </div> -->

    <div class="avatar isicon">
      <el-avatar :icon="UserFilled" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="openDialog('infoRef')">
          <el-icon><User /></el-icon>{{ $t("header.personalData") }}
        </el-dropdown-item>
        <el-dropdown-item @click="openDialog('passwordRef')">
          <el-icon><Edit /></el-icon>{{ $t("header.changePassword") }}
        </el-dropdown-item>
        <el-dropdown-item divided @click="logout">
          <el-icon><SwitchButton /></el-icon>{{ $t("header.logout") }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <!-- infoDialog -->
  <info-dialog ref="infoRef" />
  <!-- passwordDialog -->
  <password-dialog ref="passwordRef" />
</template>

<script setup lang="ts">
defineOptions({
  name: "Avatar"
});
import { ref } from "vue";
import { LOGIN_URL } from "@/config";
import { useRouter } from "vue-router";
import { logoutApi } from "@/api/modules/login";
import { useUserStore } from "@/stores/modules/user";
import { ElMessageBox, ElMessage } from "element-plus";
import InfoDialog from "./InfoDialog.vue";
import PasswordDialog from "./PasswordDialog.vue";
import { UserFilled } from "@element-plus/icons-vue";

const router = useRouter();
const userStore = useUserStore();
// Logout
const logout = () => {
  ElMessageBox.confirm("Are you sure you want to log out?", "Prompt", {
    confirmButtonText: "OK",
    cancelButtonText: "Cancel",
    type: "warning"
  }).then(async () => {
    // 1. Call logout API
    await logoutApi();

    // 2. Clear Token
    userStore.setToken("");

    // 3. Redirect to login page
    router.replace(LOGIN_URL);
    ElMessage.success("Logged out successfully!");
  });
};

// Open dialogs for editing password and personal information
const infoRef = ref<InstanceType<typeof InfoDialog> | null>(null);
const passwordRef = ref<InstanceType<typeof PasswordDialog> | null>(null);
const openDialog = (ref: string) => {
  if (ref == "infoRef") infoRef.value?.openDialog();
  if (ref == "passwordRef") passwordRef.value?.openDialog();
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
