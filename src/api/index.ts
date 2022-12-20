// import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { showFullScreenLoading, tryHideFullScreenLoading } from "@/config/serviceLoading";
// import { AxiosCanceler } from "./helper/axiosCancel";
// import { ResultData } from "@/api/interface";
import { ResultEnum } from "@/enums/httpEnum";
// import { checkStatus } from "./helper/checkStatus";
import { ElMessage } from "element-plus";
import { GlobalStore } from "@/stores";
import router from "@/routers";

import PocketBase from "pocketbase";

/**
 * pinia Example of wrong use instructions
 * https://github.com/vuejs/pinia/discussions/971
 * https://github.com/vuejs/pinia/discussions/664#discussioncomment-1329898
 * https://pinia.vuejs.org/core-concepts/outside-component-usage.html#single-page-applications
 */
// const globalStore = GlobalStore();

// console.log("import.meta.env.VITE_API_URL", import.meta.env.VITE_API_URL);

const config = {
  // The default address request address can be modified in the file of the beginning of .env
  baseURL: import.meta.env.VITE_API_URL as string,
  // Set timeout time (10s)
  timeout: ResultEnum.TIMEOUT as number,
  // Allow carrier certificates during cross-domain
  withCredentials: true
};

const client = new PocketBase(config.baseURL, undefined, "en-US");

client.beforeSend = function (url, reqConfig) {
  console.log("before send", url, reqConfig);
  // * If the current request does not need to display loading, in the API service: { headers: { noLoading: true } } Let's control not to display loading, see login api
  reqConfig.headers!.noLoading || showFullScreenLoading();
  // const globalStore = GlobalStore();
  // const token: string = globalStore.token;
  // return { ...reqConfig, headers: { ...reqConfig.headers, "x-access-token": token } };

  // For list of the possible reqConfig properties check
  // https://developer.mozilla.org/en-US/docs/Web/API/fetch#options
  // reqConfig.headers = Object.assign(reqConfig.headers, {
  // 	"X-Custom-Header": "example"
  // });

  return reqConfig;
};

client.afterSend = function (response: Response, data) {
  // do something with the response state
  console.log("after send response", response, data);

  // const { data, config } = response;
  const globalStore = GlobalStore();
  // * After the request is over, remove the request and turn off the request loading
  tryHideFullScreenLoading();

  // * Authentication failure (code == 599）
  // I don't think PocketBase has a timeout to login. I'll leave it here anyways
  if (data.code == ResultEnum.OVERDUE) {
    ElMessage.error(data.msg);
    globalStore.setToken("");
    router.replace({
      path: "/login"
    });
    return Promise.reject(data);
  }

  // * Global error information interception (return data stream when downloading files, without code, directly report an error)
  if (data.code && data.code !== ResultEnum.SUCCESS) {
    ElMessage.error(data.message);
    return Promise.reject(data);
  }

  // * Successful requests (unless special circumstances on the page, do not need to deal with the logic of failure)
  return data;
};

export default client;

const handleError = (e: unknown) => {
  let errorMessage;
  if (typeof e === "string") {
    errorMessage = e.toUpperCase(); // works, `e` narrowed to string
  } else if (e instanceof Error) {
    errorMessage = e.message; // works, `e` narrowed to Error
  }
  console.error("err", errorMessage);
  ElMessage.error(errorMessage);
};

// custom function to catch and handle errors
export const tryCatchAsync = async (tryer: Function) => {
  try {
    const result = await tryer();
    return [result, null];
  } catch (error) {
    handleError(error);
    return [null, error];
  }
};
