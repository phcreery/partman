<template>
  <el-result
    :icon="health.data.code === 200 ? 'success' : 'error'"
    :title="health.data.message"
    :sub-title="'Code: ' + health.data.code"
  >
    <template #extra>
      <el-button @click="updateHealth">Refresh</el-button>
      <el-button type="primary" @click="gotoAdminUI">Pocketbase Admin UI</el-button>
    </template>
  </el-result>
</template>

<script setup lang="tsx" name="generalSettings">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { getHealth } from "@/api/modules/components";
import { ResultData, Health } from "@/api/interface/index";

const health = ref<ResultData<Health.ResHealth>>({ code: 500, msg: "", data: { message: "", code: 0 } });

const gotoAdminUI = () => {
  window.open(import.meta.env.VITE_API_URL + "_/", "_blank");
};

const updateHealth = async () => {
  try {
    health.value.data = await getHealth();
  } catch (error) {
    console.error("Error fetching health data:", error);
  }
};

onMounted(async () => {
  await updateHealth();
});
</script>
