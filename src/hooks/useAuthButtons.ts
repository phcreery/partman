import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/modules/auth";

/**
 * @description Page button permissions
 */
export const useAuthButtons = () => {
  const route = useRoute();
  const authStore = useAuthStore();
  const authButtons = authStore.authButtonListGet[route.name as string] || [];

  const BUTTONS = computed(() => {
    const currentPageAuthButton: { [key: string]: boolean } = {};
    authButtons.forEach(item => (currentPageAuthButton[item] = true));
    return currentPageAuthButton;
  });

  return {
    BUTTONS
  };
};
