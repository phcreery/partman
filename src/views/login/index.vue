<template>
  <div class="login-container flx-center">
    <SwitchDark class="dark"></SwitchDark>
    <div class="login-box">
      <div class="login-left">
        <img class="login-icon" src="@/assets/images/logo.png" alt="login" />
      </div>
      <div class="login-form">
        <div class="login-logo">
          <h2 class="logo-text">partman</h2>
        </div>
        <LoginForm ref="loginRef"></LoginForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="login">
import SwitchDark from "@/components/SwitchDark/index.vue";
import LoginForm from "./components/LoginForm.vue";
</script>

<style scoped lang="scss">
@use "./index" as *;
</style>
