import { ElMessage } from "element-plus";

/**
 * @description: Verify network request status code
 * @param {Number} status
 * @return void
 */
export const checkStatus = (status: number): void => {
  switch (status) {
    case 400:
      ElMessage.error("Request failed! Please try again later");
      break;
    case 401:
      ElMessage.error("Login is disabled! log in again");
      break;
    case 403:
      ElMessage.error("Current account does not have permission to access! ");
      break;
    case 404:
      ElMessage.error("The resource you are accessing does not exist! ");
      break;
    case 405:
      ElMessage.error("Wrong request method! Please try again later");
      break;
    case 408:
      ElMessage.error("Request Timeout! Please try again later");
      break;
    case 500:
      ElMessage.error("Service Exception! ");
      break;
    case 502:
      ElMessage.error("Gateway error! ");
      break;
    case 503:
      ElMessage.error("Service unavailable! ");
      break;
    case 504:
      ElMessage.error("Gateway timeout! ");
      break;
    default:
      ElMessage.error("Request failed! ");
  }
};
