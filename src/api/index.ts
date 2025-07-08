// import { showFullScreenLoading, tryHideFullScreenLoading } from "@/config/serviceLoading";
import { showFullScreenLoading, tryHideFullScreenLoading } from "@/components/Loading/fullScreen";
import { ResultEnum } from "@/enums/httpEnum";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
import router from "@/routers";

import PocketBase from "pocketbase";

const config = {
  // The default address request address can be modified in the file of the beginning of .env
  baseURL: (import.meta.env.VITE_API_URL as string) || window.location.origin,
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
  // const userStore = useUserStore();
  // const token: string = userStore.token;
  // return { ...reqConfig, headers: { ...reqConfig.headers, "x-access-token": token } };

  // For list of the possible reqConfig properties check
  // https://developer.mozilla.org/en-US/docs/Web/API/fetch#options
  // reqConfig.headers = Object.assign(reqConfig.headers, {
  // 	"X-Custom-Header": "example"
  // });

  return { url, reqConfig };
};

client.afterSend = function (response: Response, data) {
  // do something with the response state
  console.log("after send response:", response, "data:", data);

  const userStore = useUserStore();

  // * After the request is over, remove the request and turn off the request loading
  tryHideFullScreenLoading();

  // * Authentication failure (code == 599）
  // I don't think PocketBase has a timeout to login. I'll leave it here anyways
  if (response.status == ResultEnum.UNAUTHORIZED || response.status == ResultEnum.TIMEOUT) {
    ElMessage({
      message: "Authentication failure",
      type: "error"
    });
    userStore.setToken("");
    router.replace({
      path: "/login"
    });
    return Promise.reject(data);
  }

  // * Global error information interception (return data stream when downloading files, without code, directly report an error)
  if (response.status && response.status !== ResultEnum.SUCCESS) {
    // ElMessage.error(data.message);
    ElMessage({
      message: data.message || "Request failed",
      type: "error"
    });
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
  // ElMessage.error(errorMessage);
  ElMessage({
    message: errorMessage || "An error occurred",
    type: "error"
  });
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
