<template>
  <el-result :icon="health.code === 200 ? 'success' : 'error'" :title="health.message" :sub-title="'Code: ' + health.code">
    <template #extra>
      <el-button @click="updateHealth">Refresh</el-button>
      <el-button type="primary" @click="gotoAdminUI">Pocketbase Admin UI</el-button>
    </template>
  </el-result>
</template>

<script setup lang="tsx" name="generalSettings">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getHealth } from "@/api/modules/components";
import type { HealthCheckResponse } from "pocketbase";

const health = ref<HealthCheckResponse>({ code: 0, message: "", data: {} });

const gotoAdminUI = () => {
  window.open(import.meta.env.VITE_API_URL + "_/", "_blank");
};

const updateHealth = async () => {
  try {
    health.value = await getHealth();
  } catch (error) {
    console.error("Error fetching health data:", error);
  }
};

onMounted(async () => {
  await updateHealth();
});
</script>
