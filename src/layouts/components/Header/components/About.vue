<template>
  <div style="height: 16px">
    <!-- <el-tooltip effect="dark" content="About" placement="bottom"> -->
    <!-- <i :class="'iconfont icon-info'" class="icon-style toolBar-icon" @click="openDrawer"></i> -->
    <el-icon class="icon-style el-icon toolBar-icon" style="cursor: pointer" @click="openDrawer"><InfoFilled /></el-icon>
    <!-- </el-tooltip> -->
    <el-drawer v-model="drawerVisible" title="About" size="300px">
      <el-divider class="divider" content-position="center">
        <div class="divider-content">partman {{ version }}</div>
      </el-divider>
      <p><a href="https://github.com/phcreery/partman">https://github.com/phcreery/partman</a></p>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { InfoFilled } from "@element-plus/icons-vue";

const version = APP_VERSION;

// Open the theme settings
const drawerVisible = ref(false);
const openDrawer = () => {
  drawerVisible.value = true;
};
</script>

<style scoped lang="scss">
// @import "../index.scss";
</style>
