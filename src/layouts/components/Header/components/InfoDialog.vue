<template>
  <el-dialog v-model="dialogVisible" title="User Information" width="500px" draggable>
    <el-descriptions border :column="1">
      <el-descriptions-item label="Username" label-align="right">{{ userInfo.username }}</el-descriptions-item>
      <el-descriptions-item label="Email" label-align="right">{{ userInfo.email }}</el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/modules/user";

const dialogVisible = ref(false);
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

// openDialog
const openDialog = async () => {
  dialogVisible.value = true;
};

defineExpose({ openDialog });
</script>
