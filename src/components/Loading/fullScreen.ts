import { ElLoading } from "element-plus";

/* Global request loading */
let loadingInstance: ReturnType<typeof ElLoading.service>;

/**
 * @description Start Loading
 * */
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

/**
 * @description End Loading
 * */
const endLoading = () => {
  loadingInstance.close();
};

/**
 * @description Show fullscreen loading
 * */
let needLoadingRequestCount = 0;
export const showFullScreenLoading = () => {
  if (needLoadingRequestCount === 0) {
    needLoadingRequestCount++;
    startLoading();
  } else {
    needLoadingRequestCount++;
  }
};

/**
 * @description Hide fullscreen loading
 * */
export const tryHideFullScreenLoading = () => {
  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    endLoading();
  }
};
