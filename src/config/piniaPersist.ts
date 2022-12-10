import { PersistedStateOptions } from "pinia-plugin-persistedstate";

/**
 * @description Pinia persistent parameter configuration
 * @param {String} key Store to persistent name
 * @return persist
 * */
const piniaPersistConfig = (key: string) => {
  const persist: PersistedStateOptions = {
    key,
    storage: window.localStorage
    // storage: window.sessionStorage,
  };
  return persist;
};

export default piniaPersistConfig;
