<template>
  <div class="card content-box">
    <span class="text">我是menu2-3 🍓🍇🍈🍉</span>
    <el-input v-model="value" placeholder="测试缓存" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Menu23' })
import { ref } from 'vue'
const value = ref('')
</script>

<style scoped lang="scss">
@use './index';
</style>
