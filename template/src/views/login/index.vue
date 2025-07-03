<template>
  <div class="login-container flx-center">
    <div class="login-box">
      <switch-dark class="dark" />
      <div class="login-left">
        <img class="login-left-img" src="@/assets/images/login_left.png" alt="login" />
      </div>
      <div class="login-form">
        <div class="login-logo">
          <img class="login-icon" src="@/assets/images/logo.svg" alt="" />
          <h2 class="logo-text">Geeker-Admin</h2>
        </div>
        <login-form />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Login' })
import LoginForm from './components/LoginForm.vue'
import SwitchDark from '@/components/SwitchDark/index.vue'
</script>

<style scoped lang="scss">
@use './index';
</style>
