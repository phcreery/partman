import { defineStore } from "pinia";
import { AuthState } from "@/stores/interface";
import { getFlatArr } from "@/utils/util";
import { getAuthButtonListApi, getAuthMenuListApi } from "@/api/modules/login";
import { getKeepAliveRouterName, getShowMenuList, getAllBreadcrumbList } from "@/utils/util";
import piniaPersistConfig from "@/config/piniaPersist";

// AuthStore
export const AuthStore = defineStore({
  id: "AuthState",
  state: (): AuthState => ({
    // The current page of router name，Used for button permission filtering
    routeName: "",
    // Button permission list
    authButtonList: {},
    // menuList As a dynamic route，Won't do persistent storage
    authMenuList: []
  }),
  getters: {
    // Button permission list
    authButtonListGet: state => state.authButtonList,
    // List of menus returned by the backend ==> There is no processing here
    authMenuListGet: state => state.authMenuList,
    // List of menus returned by the backend ==> Left menu bar rendering，Need to remove isHide == true
    showMenuListGet: state => getShowMenuList(state.authMenuList),
    // One-dimensional array routing after flattening，Mainly used to add dynamic routes
    flatMenuListGet: state => getFlatArr(state.authMenuList),
    // All breadcrumb navigation list
    breadcrumbListGet: state => getAllBreadcrumbList(state.authMenuList),
    // Menus that need to be cached name，Use as page keepAlive
    keepAliveRouterGet: state => getKeepAliveRouterName(state.authMenuList)
  },
  actions: {
    // getAuthButtonList
    async getAuthButtonList() {
      const { data } = await getAuthButtonListApi();
      this.authButtonList = data;
    },
    // getAuthMenuList
    async getAuthMenuList() {
      const { data } = await getAuthMenuListApi();
      this.authMenuList = data;
    },
    // setRouteName
    async setRouteName(name: string) {
      this.routeName = name;
    }
  },
  persist: piniaPersistConfig("AuthState", ["routeName", "authButtonList"])
});
