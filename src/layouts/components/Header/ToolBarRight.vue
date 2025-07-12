<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <!-- About -->
      <About />
      <AssemblySize />
      <!-- <Language id="language" /> -->
      <SearchMenu />
      <!-- <ThemeSetting id="themeSetting" /> -->
      <!-- <Message id="message" /> -->
      <Fullscreen />
      <SwitchDark />
    </div>
    <span class="username">{{ userInfo?.username }}</span>
    <Avatar />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

// Components
import SearchMenu from "./components/SearchMenu.vue";
import Fullscreen from "./components/Fullscreen.vue";
// import Message from "./components/Message.vue";
// import Language from "./components/Language.vue";
// import ThemeSetting from "./components/ThemeSetting.vue";
import AssemblySize from "./components/AssemblySize.vue";
import Avatar from "./components/Avatar.vue";
import About from "./components/About.vue";
import SwitchDark from "@/components/SwitchDark/index.vue";

// Stores
import { useUserStore } from "@/stores/modules/user";
import { UserState } from "@/stores/interface";

const userStore = useUserStore();
const userInfo = computed<UserState["userInfo"]>(() => userStore.userInfo);
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
