<template>
  <el-dialog v-model="dialogVisible" title="Account Information" width="500px" draggable>
    <span>This is user info</span>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
const dialogVisible = ref(false);

// openDialog
const openDialog = () => {
  dialogVisible.value = true;
};

defineExpose({
  openDialog
});
</script>
