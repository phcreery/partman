import axios, { AxiosRequestConfig, Canceler } from "axios";
import { isFunction } from "@/utils/is/index";
import qs from "qs";

// * Declare a Map Used to store the identity of each request and Cancel function
let pendingMap = new Map<string, Canceler>();

// * Serialization parameters
export const getPendingUrl = (config: AxiosRequestConfig) =>
	[config.method, config.url, qs.stringify(config.data), qs.stringify(config.params)].join("&");

export class AxiosCanceler {
	/**
	 * @description: Add request
	 * @param {Object} config
	 * @return void
	 */
	addPending(config: AxiosRequestConfig) {
		// * Before the request starts，Do a check cancel operation on the previous request
		this.removePending(config);
		const url = getPendingUrl(config);
		config.cancelToken =
			config.cancelToken ||
			new axios.CancelToken(cancel => {
				if (!pendingMap.has(url)) {
					// If pending No current request exists in，then add in
					pendingMap.set(url, cancel);
				}
			});
	}

	/**
	 * @description: Remove request
	 * @param {Object} config
	 */
	removePending(config: AxiosRequestConfig) {
		const url = getPendingUrl(config);

		if (pendingMap.has(url)) {
			// If the pending The current request identifier exists in，Need to cancel current request，and remove
			const cancel = pendingMap.get(url);
			cancel && cancel();
			pendingMap.delete(url);
		}
	}

	/**
	 * @description: Clear allpending
	 */
	removeAllPending() {
		pendingMap.forEach(cancel => {
			cancel && isFunction(cancel) && cancel();
		});
		pendingMap.clear();
	}

	/**
	 * @description: Reset
	 */
	reset(): void {
		pendingMap = new Map<string, Canceler>();
	}
}
