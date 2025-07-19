<template>
  <div class="card content-box">
    <el-tabs v-model="activeTabName" style="width: 100%">
      <el-tab-pane label="Server" name="server">
        <HealthPage />
      </el-tab-pane>

      <el-tab-pane label="Octopart" name="octopart">
        <OctopartConfig />
      </el-tab-pane>

      <!-- <el-tab-pane label="Database" name="database"> DB {{ backups }} </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script setup lang="tsx" name="generalSettings">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import HealthPage from "./Health.vue";
import OctopartConfig from "./OctopartConfig.vue";

const activeTabName = ref("server");
</script>
