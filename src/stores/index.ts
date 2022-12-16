import { defineStore, createPinia } from "pinia";
import { GlobalState, ThemeConfigProps } from "./interface";
import { DEFAULT_PRIMARY } from "@/config/config";
import piniaPersistConfig from "@/config/piniaPersist";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// defineStore Returns a function after the call，Call this function to get the Store Entity
export const GlobalStore = defineStore({
	// id: Required，In all Store The only
	id: "GlobalState",
	// state: Functions that return objects
	state: (): GlobalState => ({
		// token
		token: "",
		// userInfo
		userInfo: "",
		// elementComponent size
		assemblySize: "default",
		// language
		language: "",
		// themeConfig
		themeConfig: {
			// Layout switching ==>  Vertical：vertical | Classic：classic | Horizontal：transverse | Subcolumn：columns
			layout: "vertical",
			// Default primary Theme Color
			primary: DEFAULT_PRIMARY,
			// Dark Mode
			isDark: false,
			// Grey Mode
			isGrey: false,
			// Color vision mode
			isWeak: false,
			// Folded Menu
			isCollapse: false,
			// Breadcrumb navigation
			breadcrumb: true,
			// Breadcrumb navigation icon
			breadcrumbIcon: true,
			// Tabs
			tabs: true,
			// Tab icons
			tabsIcon: true,
			// Footer
			footer: true,
			// Whether the current page is full screen
			maximize: false
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
		setAssemblySizeSize(assemblySize: string) {
			this.assemblySize = assemblySize;
		},
		// updateLanguage
		updateLanguage(language: string) {
			this.language = language;
		},
		// setThemeConfig
		setThemeConfig(themeConfig: ThemeConfigProps) {
			this.themeConfig = themeConfig;
		}
	},
	persist: piniaPersistConfig("GlobalState")
});

// piniaPersist(Durability)
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;
