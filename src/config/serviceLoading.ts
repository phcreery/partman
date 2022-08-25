import { ElLoading } from "element-plus";

/* Global request loading(Service method call) */
let loadingInstance: ReturnType<typeof ElLoading.service>;

const startLoading = () => {
	loadingInstance = ElLoading.service({
		fullscreen: true,
		lock: true,
		text: "Loading",
		background: "rgba(0, 0, 0, 0.7)"
	});
};
const endLoading = () => {
	loadingInstance.close();
};

// So showFullScreenLoading() tryHideFullScreenLoading() What to do is to merge the request at the same time.
// Deak a variable needLoadingRequestCount，Each time you call ShowfullScreenLoading method needLoadingRequestCount + 1。
// Call TryhideFullScreenLoading() method，needLoadingRequestCount - 1.When NeedloadingRequestCount is 0, Loading is over.
let needLoadingRequestCount = 0;
export const showFullScreenLoading = () => {
	// console.log("show full screen (loading...)");
	if (needLoadingRequestCount === 0) {
		startLoading();
	}
	needLoadingRequestCount++;
};

export const tryHideFullScreenLoading = () => {
	// console.log("hide screen hide (done)");
	if (needLoadingRequestCount <= 0) return;
	needLoadingRequestCount--;
	if (needLoadingRequestCount === 0) {
		endLoading();
	}
};
