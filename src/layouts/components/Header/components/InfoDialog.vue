<template>
  <el-dialog v-model="dialogVisible" title="User Information" width="500px" draggable>
    <el-descriptions border :column="1">
      <el-descriptions-item label="Name">{{ userInfo.name }}</el-descriptions-item>
      <el-descriptions-item label="Username">{{ userInfo.username }}</el-descriptions-item>
      <el-descriptions-item label="Email">{{ userInfo.email }}</el-descriptions-item>
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
import { GlobalStore } from "@/stores";
// import { getUser } from "@/api/modules/components";

const dialogVisible = ref(false);
const globalStore = GlobalStore();
const userInfo = computed(() => globalStore.userInfo);

// openDialog
const openDialog = async () => {
  dialogVisible.value = true;
  // const userInfo = await getUser();
  console.log(userInfo);
};

defineExpose({ openDialog });
</script>
