import { defineStore } from "pinia";
import type { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";

export const useUserStore = defineStore("geeker-user", {
  state: (): UserState => ({
    token: "",
    userInfo: { id: "", email: "", avatar: "", username: "" }
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token;
    },
    // Set setUserInfo
    setUserInfo(userInfo: UserState["userInfo"]) {
      this.userInfo = userInfo;
    }
  },
  persist: piniaPersistConfig("geeker-user")
});
