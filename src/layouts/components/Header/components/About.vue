<template>
  <el-icon style="cursor: pointer" @click="openDrawer"><InfoFilled /></el-icon>
  <el-drawer v-model="drawerVisible" title="About" size="300px">
    <el-divider class="divider" content-position="center">
      <div class="divider-content">partman {{ version }}</div>
    </el-divider>
    <p><a href="https://github.com/phcreery/partman">https://github.com/phcreery/partman</a></p>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { InfoFilled } from "@element-plus/icons-vue";

const version = __APP_INFO__.pkg.version; // Get the version from the build info

// Open the theme settings
const drawerVisible = ref(false);
const openDrawer = () => {
  drawerVisible.value = true;
};
</script>

<style scoped lang="scss"></style>
