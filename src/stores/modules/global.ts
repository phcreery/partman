import { defineStore } from "pinia";
import type { GlobalState } from "@/stores/interface";
import { DEFAULT_PRIMARY } from "@/config";
import piniaPersistConfig from "@/stores/helper/persist";

export const useGlobalStore = defineStore<"geeker-global", GlobalState>("geeker-global", {
  // After modifying the default value, you need to clear localStorage data
  state: (): GlobalState => ({
    // Layout mode (vertical | classic | transverse | columns)
    layout: "vertical",
    // Element component size
    assemblySize: "default",
    // Current system language
    language: null,
    // Is the current page fullscreen
    maximize: false,
    // Theme color
    primary: DEFAULT_PRIMARY,
    // Dark mode
    isDark: false,
    // Grey mode
    isGrey: false,
    // Weak color mode
    isWeak: false,
    // Sidebar inverted
    asideInverted: false,
    // Header inverted
    headerInverted: false,
    // Collapse menu
    isCollapse: false,
    // Menu accordion
    accordion: true,
    // Page watermark
    watermark: false,
    // Breadcrumb navigation
    breadcrumb: true,
    // Breadcrumb navigation icon
    breadcrumbIcon: true,
    // Tabs
    tabs: true,
    // Tabs icon
    tabsIcon: true,
    // Footer
    footer: false
  }),
  getters: {},
  actions: {
    // Set GlobalState
    setGlobalState<K extends keyof GlobalState>(key: K, value: GlobalState[K]) {
      this.$patch({ [key]: value });
    }
  },
  persist: piniaPersistConfig("geeker-global")
});
