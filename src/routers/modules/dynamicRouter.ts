import router from "@/routers/index";
import { LOGIN_URL } from "@/config";
import type { RouteRecordRaw } from "vue-router";
import { ElNotification } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
import { useAuthStore } from "@/stores/modules/auth";

// Import all vue files under the views folder
const modules = import.meta.glob("@/views/**/*.vue");

/**
 * @description Initialize dynamic routes
 */
export const initDynamicRouter = async () => {
  const userStore = useUserStore();
  const authStore = useAuthStore();

  try {
    // 1. Get menu list & button permission list
    await authStore.getAuthMenuList();
    await authStore.getAuthButtonList();

    // 2. Check if the current user has menu permissions
    console.log("authStore.authMenuListGet", authStore.authMenuListGet);
    if (!authStore.authMenuListGet.length) {
      ElNotification({
        title: "No Access Permission",
        message: "The current account has no menu permissions. Please contact the system administrator!",
        type: "warning",
        duration: 3000
      });
      userStore.setToken("");
      router.replace(LOGIN_URL);
      return Promise.reject("No permission");
    }

    // 3. Add dynamic routes
    authStore.flatMenuListGet.forEach(item => {
      item.children && delete item.children;
      if (item.component && typeof item.component == "string") {
        item.component = modules["/src/views" + item.component + ".vue"];
      }
      if (item.meta.isFull) {
        router.addRoute(item as unknown as RouteRecordRaw);
      } else {
        router.addRoute("layout", item as unknown as RouteRecordRaw);
      }
    });
  } catch (error) {
    // When button or menu request fails, redirect to login page
    userStore.setToken("");
    router.replace(LOGIN_URL);
    return Promise.reject(error);
  }
};
