import { ElMessageBox, ElMessage } from "element-plus";
import { HandleData } from "./interface";

/**
 * @description Operate a single data information (secondary confirmation [delete, disable, enable, reset password])
 * @param {Function} api API method of operating data interface(Must pass)
 * @param {Object} params The operation data parameters carried {id,params}(Must pass)
 * @param {String} message Prompt information(Must pass)
 * @param {String} confirmType Icon type(No need to pass,The default is warning)
 * @return Promise
 */
export const useHandleData = <P = any, R = any>(
	api: (params: P) => Promise<R>,
	params: Parameters<typeof api>[0],
	message: string,
	confirmType: HandleData.MessageType = "warning"
) => {
	return new Promise((resolve, reject) => {
		ElMessageBox.confirm(`${message}?`, "Are you sure?", {
			confirmButtonText: "Yes",
			cancelButtonText: "Cancel",
			type: confirmType,
			draggable: true
		}).then(async () => {
			const res = await api(params);
			if (!res) return reject(false);
			ElMessage({
				type: "success",
				message: `${message} success!`
			});
			resolve(true);
		});
	});
};
