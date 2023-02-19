import { ElMessageBox, ElMessage } from "element-plus";
import { HandleData } from "./interface";

/**
 * @description Manipulate single data message(Secondary confirmation【Delete、Disable、Enable、Reset Password】)
 * @param {Function} api Operating the data interface of theapiMethods(Must Pass)
 * @param {Object} params Operating data parameters carried {id,params}(Must Pass)
 * @param {String} message Tip Message(Must Pass)
 * @param {String} confirmType iconType(No need to pass,Default is warning)
 * @return Promise
 */
export const useHandleData = <P = any, R = any>(
  api: (params: P) => Promise<R>,
  params: Parameters<typeof api>[0],
  message: string,
  confirmType: HandleData.MessageType = "warning"
) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(`whether${message}?`, "Notification", {
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      type: confirmType,
      draggable: true
    }).then(async () => {
      const res = await api(params);
      if (!res) return reject(false);
      ElMessage({
        type: "success",
        message: `${message} Success!`
      });
      resolve(true);
    });
  });
};
