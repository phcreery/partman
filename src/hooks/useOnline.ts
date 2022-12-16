import { ref, onMounted, onUnmounted } from "vue";

/**
 * @description Network availability
 * */
export const useOnline = () => {
	const online = ref(true);
	const showStatus = (val: any) => {
		online.value = typeof val == "boolean" ? val : val.target.online;
	};
	// After the page loads，Set the correct network state
	navigator.onLine ? showStatus(true) : showStatus(false);

	onMounted(() => {
		// Start listening for changes in network status
		window.addEventListener("online", showStatus);
		window.addEventListener("offline", showStatus);
	});

	onUnmounted(() => {
		// Remove listening to network state changes
		window.removeEventListener("online", showStatus);
		window.removeEventListener("offline", showStatus);
	});

	return { online };
};
