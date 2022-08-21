import { defineStore } from "pinia";
import { AuthState } from "../interface";
import piniaPersistConfig from "@/config/piniaPersist";

// AuthStore
export const AuthStore = defineStore({
	id: "AuthState",
	state: (): AuthState => ({
		// User button permission list
		authButtons: {},
		// Route permission list
		authRouter: []
	}),
	getters: {
		// Process permissions button data for convenient control button
		authButtonsObj: state => {
			return state.authButtons;
		},
		// The menu data returned in the background is used to facilitate controlling the right time of the routing jump (here is a one -dimensional array)
		dynamicRouter: state => {
			return state.authRouter;
		}
	},
	actions: {
		// setAuthButtons
		async setAuthButtons(authButtonList: { [key: string]: any }) {
			this.authButtons = authButtonList;
		},
		// setAuthRouter
		async setAuthRouter(dynamicRouter: string[]) {
			this.authRouter = dynamicRouter;
		}
	},
	persist: piniaPersistConfig("AuthState")
});
