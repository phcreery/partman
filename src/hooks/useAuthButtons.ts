import { AuthStore } from "@/store/modules/auth";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

/**
 * @description Page button permission
 * */
export const useAuthButtons = () => {
	// Current page keyword
	const nowKey = ref<string>("");
	// The current page routing object
	const route = useRoute();

	nowKey.value = route.meta.key as string;

	// Current page button permission list
	const BUTTONS = computed(() => {
		const authStore = AuthStore();
		// Before the interface data is obtained, it is set to an empty object, otherwise the error will be reported
		return authStore.authButtonsObj[nowKey.value] || {};
	});

	return {
		nowKey,
		BUTTONS
	};
};
