<template>
  <div class="header">
    <div class="header-lf flx-center">
      <CollapseIcon id="collapseIcon"></CollapseIcon>
      <Breadcrumb id="breadcrumb" v-if="themeConfig.breadcrumb"></Breadcrumb>
    </div>
    <div class="header-ri flx-center">
      <div class="header-icon">
        <!-- About -->
        <About id="about"></About>
        <!-- Assembly size -->
        <AssemblySize id="assemblySize"></AssemblySize>
        <!-- Language -->
        <!-- <Language id="language"></Language> -->
        <!-- Theme -->
        <Theme id="theme"></Theme>
        <!-- Full screen -->
        <Fullscreen id="fullscreen"></Fullscreen>
        <!-- SearchMenu -->
        <SearchMenu id="searchMenu"></SearchMenu>
      </div>
      <!-- User name -->
      <span class="username">{{ userInfo?.name }}</span>
      <!-- Avatar -->
      <Avatar></Avatar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import CollapseIcon from "./components/CollapseIcon.vue";
import Breadcrumb from "./components/Breadcrumb.vue";
import SearchMenu from "./components/SearchMenu.vue";
import Fullscreen from "./components/Fullscreen.vue";
import Language from "./components/Language.vue";
import AssemblySize from "./components/AssemblySize.vue";
import Theme from "./components/Theme.vue";
import Avatar from "./components/Avatar.vue";
import About from "./components/About.vue";
import { GlobalStore } from "@/store";

const globalStore = GlobalStore();
const themeConfig = computed(() => globalStore.themeConfig);
const userInfo = computed(() => globalStore.userInfo);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
