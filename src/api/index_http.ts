import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { showFullScreenLoading, tryHideFullScreenLoading } from "@/config/serviceLoading";
import { AxiosCanceler } from "./helper/axiosCancel";
// import { ResultData } from "@/api/interface";
import { ResultEnum } from "@/enums/httpEnum";
import { checkStatus } from "./helper/checkStatus";
import { ElMessage } from "element-plus";
import { GlobalStore } from "@/stores";
import router from "@/routers";

/**
 * pinia Example of wrong use instructions
 * https://github.com/vuejs/pinia/discussions/971
 * https://github.com/vuejs/pinia/discussions/664#discussioncomment-1329898
 * https://pinia.vuejs.org/core-concepts/outside-component-usage.html#single-page-applications
 */
// const globalStore = GlobalStore();

const axiosCanceler = new AxiosCanceler();

console.log("import.meta.env.VITE_API_URL", import.meta.env.VITE_API_URL);
console.log("window.location.origin", window.location.origin);

const config = {
  // The default address request address can be modified in the .env file
  // baseURL: import.meta.env.VITE_API_URL as string,
  baseURL: window.location.origin,
  // Set timeout time (10s)
  timeout: ResultEnum.TIMEOUT as number,
  // Allow carrier certificates during cross -domain
  withCredentials: true
};

class RequestHttp {
  service: AxiosInstance;
  public constructor(config: AxiosRequestConfig) {
    // Instantiated AXIOS
    this.service = axios.create(config);

    /**
     * @description Request interceptor
     * Client sending request-> [Request interceptor] -> server
     * Token verification (JWT): Accept the token returned by the server, stored in Vuex/Pinia/local storage
     */
    this.service.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const globalStore = GlobalStore();
        // * Add the current request to pending
        axiosCanceler.addPending(config);
        // * If the current request does not need to display loading, in the API service: { headers: { noLoading: true } } Let's control not to display loading, see loginapi
        config.headers!.noLoading || showFullScreenLoading();
        const token: string = globalStore.token;
        return { ...config, headers: { ...config.headers, "x-access-token": token } };
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    /**
     * @description Response interceptor
     *  The server replace the return information -> [intercepting unified processing] -> Client JS get information
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data, config } = response;
        const globalStore = GlobalStore();
        // * After the request is over, remove the request and turn off the request loading
        axiosCanceler.removePending(config);
        tryHideFullScreenLoading();
        // * Login failure (code == 599）
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
          ElMessage.error(data.msg);
          return Promise.reject(data);
        }
        // * Successful requests (unless special circumstances on the page, do not need to deal with the logic of failure)
        return data;
      },
      async (error: AxiosError) => {
        const { response } = error;
        tryHideFullScreenLoading();
        // The request timeout is judged separately, because there is no response on the request timeout
        if (error.message.indexOf("timeout") !== -1) ElMessage.error("Request timed out! Please try again later");
        // Depending on the wrong status code of the response, do different processing
        if (response) checkStatus(response.status);
        // None of the server results returned (maybe the server error may be the client break).
        if (!window.navigator.onLine) router.replace({ path: "/500" });
        return Promise.reject(error);
      }
    );
  }

  // * Common request method packaging
  // get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
  // 	return this.service.get(url, { params, ..._object });
  // }
  // post<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
  // 	return this.service.post(url, params, _object);
  // }
  // put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
  // 	return this.service.put(url, params, _object);
  // }
  // delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
  // 	return this.service.delete(url, { params, ..._object });
  // }
}

export default new RequestHttp(config);
