<template>
  <div class="not-container">
    <img src="@/assets/images/404.png" class="not-img" alt="404" />
    <div class="not-detail">
      <h2>404</h2>
      <h4>Sorry, the page you visited does not exist~🤷‍♂️🤷‍♀️</h4>
      <el-button type="primary" @click="router.back">Go Back</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "404" });
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<style scoped lang="scss">
@use "./index";
</style>
