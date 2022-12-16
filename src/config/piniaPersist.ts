import { PersistedStateOptions } from "pinia-plugin-persistedstate";

/**
 * @description piniaPersistent parameter configuration
 * @param {String} key Store to persistent name
 * @param {Array} paths Persistent required state name
 * @return persist
 * */
const piniaPersistConfig = (key: string, paths?: string[]) => {
	const persist: PersistedStateOptions = {
		key,
		storage: window.localStorage,
		// storage: window.sessionStorage,
		paths
	};
	return persist;
};

export default piniaPersistConfig;
