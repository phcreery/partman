import { defineStore } from "pinia";
import type { AuthState } from "@/stores/interface";
import { getAuthButtonListApi, getAuthMenuListApi } from "@/api/modules/auth";
import { getFlatMenuList, getShowMenuList, getAllBreadcrumbList } from "@/utils";

export const useAuthStore = defineStore("geeker-auth", {
  state: (): AuthState => ({
    // Button permission list
    authButtonList: {},
    // Menu permission list
    authMenuList: [],
    // The router name of the current page, used for button permission filtering
    routeName: ""
  }),
  getters: {
    // Button permission list
    authButtonListGet: state => state.authButtonList,
    // Menu permission list ==> The menu here is not processed
    authMenuListGet: state => state.authMenuList,
    // Menu permission list ==> For rendering the left sidebar, need to remove items with isHide == true
    showMenuListGet: state => getShowMenuList(state.authMenuList),
    // Menu permission list ==> Flattened one-dimensional array menu, mainly used to add dynamic routes
    flatMenuListGet: state => getFlatMenuList(state.authMenuList),
    // All breadcrumb navigation lists after recursive processing
    breadcrumbListGet: state => getAllBreadcrumbList(state.authMenuList)
  },
  actions: {
    // Get AuthButtonList
    async getAuthButtonList() {
      this.authButtonList = await getAuthButtonListApi();
    },
    // Get AuthMenuList
    async getAuthMenuList() {
      this.authMenuList = await getAuthMenuListApi();
    },
    // Set RouteName
    async setRouteName(name: string) {
      this.routeName = name;
    }
  }
});
