import { defineStore } from "pinia";
import { GlobalState, ThemeConfigProp } from "./interface";
import { createPinia } from "pinia";
import piniaPersistConfig from "@/config/piniaPersist";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// defineStore After calling, return a function, call the function to get the store entity
export const GlobalStore = defineStore({
	// id: Must, the only one among all stores
	id: "GlobalState",
	// state: The function of the return object
	state: (): GlobalState => ({
		// token
		token: "",
		// userInfo
		userInfo: null,
		// element Component size
		assemblySize: "default",
		// language
		language: "en",
		// themeConfig
		themeConfig: {
			// Default primary theme color
			primary: "#1E5F4C",
			// Dark Mode
			isDark: false,
			// Gray mode
			isGrey: false,
			// Weak pattern
			isWeak: false,
			// Breadcrumbs
			breadcrumb: true,
			// Bookmark page
			tabs: true,
			// Footer
			footer: false
		}
	}),
	getters: {},
	actions: {
		// setToken
		setToken(token: string) {
			this.token = token;
		},
		// setUserInfo
		setUserInfo(userInfo: any) {
			this.userInfo = userInfo;
		},
		// setAssemblySizeSize
		setAssemblySizeSize(assemblySize: "default" | "large" | "small") {
			this.assemblySize = assemblySize;
		},
		// updateLanguage
		updateLanguage(language: string) {
			this.language = language;
		},
		// setThemeConfig
		setThemeConfig(themeConfig: ThemeConfigProp) {
			this.themeConfig = themeConfig;
		}
	},
	persist: piniaPersistConfig("GlobalState")
});

// piniaPersist
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;
