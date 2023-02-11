import { ElLoading } from "element-plus";

/* Global request loading(服务方式Call) */
let loadingInstance: ReturnType<typeof ElLoading.service>;

const startLoading = () => {
  if (loadingInstance && !loadingInstance.closed) {
    return;
  }
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

// Then showFullScreenLoading() tryHideFullScreenLoading() The thing to do is to merge the requests at the same moment。
// Declare a variable needLoadingRequestCount，Each time you callshowFullScreenLoadingMethods needLoadingRequestCount + 1。
// 调用tryHideFullScreenLoading()Methods，needLoadingRequestCount - 1。needLoadingRequestCountfor 0 Time，End loading。
let needLoadingRequestCount = 0;
export const showFullScreenLoading = () => {
  if (needLoadingRequestCount === 0) {
    needLoadingRequestCount++;
    startLoading();
  } else {
    needLoadingRequestCount++;
  }
};

export const tryHideFullScreenLoading = () => {
  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    endLoading();
  }
};
