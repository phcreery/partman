import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { AuthStore } from "@/stores/modules/auth";

/**
 * @description Page button permissions
 * */
export const useAuthButtons = () => {
	// Current page keywords
	const nowKey = ref<string>("");
	// Current page routing object
	const route = useRoute();

	nowKey.value = route.name as string;

	// Current page button permission list
	const BUTTONS = computed(() => {
		const authStore = AuthStore();
		// Before getting the interface data，Set to empty object，Otherwise, an error is reported
		return authStore.authButtonListGet[nowKey.value] || {};
	});

	return {
		nowKey,
		BUTTONS
	};
};
