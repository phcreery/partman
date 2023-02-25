<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <!-- About -->
      <About id="about"></About>
      <AssemblySize id="assemblySize" />
      <!-- <Language id="language" /> -->
      <SearchMenu id="searchMenu" />
      <!-- <ThemeSetting id="themeSetting" /> -->
      <!-- <Message id="message" /> -->
      <Fullscreen id="fullscreen" />
      <SwitchDark />
    </div>
    <span class="username">{{ userInfo?.name }}</span>
    <Avatar />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SearchMenu from "./components/SearchMenu.vue";
import Fullscreen from "./components/Fullscreen.vue";
// import Message from "./components/Message.vue";
// import Language from "./components/Language.vue";
// import ThemeSetting from "./components/ThemeSetting.vue";
import AssemblySize from "./components/AssemblySize.vue";
import Avatar from "./components/Avatar.vue";
import About from "./components/About.vue";
import SwitchDark from "@/components/SwitchDark/index.vue";

import { GlobalStore } from "@/stores";

const globalStore = GlobalStore();
const userInfo = computed(() => globalStore.userInfo);
</script>

<style scoped lang="scss">
.tool-bar-ri {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 30px;
  .header-icon {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 140px;
    margin-right: 22px;
  }
  .username {
    margin: 0 20px 0 0;
    font-size: 15px;
  }
}
</style>
