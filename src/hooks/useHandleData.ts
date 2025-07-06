import { ElMessageBox, ElMessage } from "element-plus";

type MessageType = "" | "success" | "warning" | "info" | "error";

/**
 * @description Handle single data operation (secondary confirmation: delete, disable, enable, reset password)
 * @param {Function} api The API method for the operation (required)
 * @param {Object} params Parameters for the operation {id, params} (required)
 * @param {String} message Prompt message (required)
 * @param {String} confirmType Icon type (optional, defaults to 'warning')
 * @returns {Promise}
 */
export const useHandleData = (
  api: (_params: any) => Promise<any>,
  params: any = {},
  message: string,
  confirmType: MessageType = "warning"
) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(`Do you want to ${message}?`, "Prompt", {
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      type: confirmType,
      draggable: true
    })
      .then(async () => {
        const res = await api(params);
        if (!res) return reject(false);
        ElMessage({
          type: "success",
          message: `${message} succeeded!`
        });
        resolve(true);
      })
      .catch(() => {
        // cancel operation
      });
  });
};
