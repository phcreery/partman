import { isArray } from "@/utils/is";

/**
 * @description GetlocalStorage
 * @param {String} key StorageName
 * @return string
 */
export function localGet(key: string) {
  const value = window.localStorage.getItem(key);
  try {
    return JSON.parse(window.localStorage.getItem(key) as string);
  } catch (error) {
    return value;
  }
}

/**
 * @description StoragelocalStorage
 * @param {String} key StorageName
 * @param {Any} value StorageValue
 * @return void
 */
export function localSet(key: string, value: any) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * @description ClearlocalStorage
 * @param {String} key StorageName
 * @return void
 */
export function localRemove(key: string) {
  window.localStorage.removeItem(key);
}

/**
 * @description Clear alllocalStorage
 * @return void
 */
export function localClear() {
  window.localStorage.clear();
}

/**
 * @description Determining the data type
 * @param {Any} val 需要判断类型of数据
 * @return string
 */
export function isType(val: any) {
  if (val === null) return "null";
  if (typeof val !== "object") return typeof val;
  else return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase();
}

/**
 * @description Generate unique uuid
 * @return string
 */
export function generateUUID() {
  if (typeof crypto === "object") {
    if (typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    if (typeof crypto.getRandomValues === "function" && typeof Uint8Array === "function") {
      const callback = (c: any) => {
        const num = Number(c);
        return (num ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))).toString(16);
      };
      return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, callback);
    }
  }
  let timestamp = new Date().getTime();
  let performanceNow = (typeof performance !== "undefined" && performance.now && performance.now() * 1000) || 0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    let random = Math.random() * 16;
    if (timestamp > 0) {
      random = (timestamp + random) % 16 | 0;
      timestamp = Math.floor(timestamp / 16);
    } else {
      random = (performanceNow + random) % 16 | 0;
      performanceNow = Math.floor(performanceNow / 16);
    }
    return (c === "x" ? random : (random & 0x3) | 0x8).toString(16);
  });
}

/**
 * Determine if two objects are identical
 * @param a Object I to be compared
 * @param b Object II to be compared
 * @returns Same return true，The opposite is true
 */
export function isObjectValueEqual(a: { [key: string]: any }, b: { [key: string]: any }) {
  if (!a || !b) return false;
  let aProps = Object.getOwnPropertyNames(a);
  let bProps = Object.getOwnPropertyNames(b);
  if (aProps.length != bProps.length) return false;
  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i];
    let propA = a[propName];
    let propB = b[propName];
    if (!b.hasOwnProperty(propName)) return false;
    if (propA instanceof Object) {
      if (!isObjectValueEqual(propA, propB)) return false;
    } else if (propA !== propB) {
      return false;
    }
  }
  return true;
}

/**
 * @description Generate random numbers
 * @param {Number} min 最小Value
 * @param {Number} max Maximum value
 * @return number
 */
export function randomNum(min: number, max: number): number {
  let num = Math.floor(Math.random() * (min - max) + max);
  return num;
}

/**
 * @description Get current time对应的提示语
 * @return string
 */
export function getTimeState() {
  // 获取Current时间
  let timeNow = new Date();
  // Get current hour
  let hours = timeNow.getHours();
  // 判断When前时间段
  if (hours >= 6 && hours <= 10) return `Good Morning ⛅`;
  if (hours >= 10 && hours <= 14) return `Medium午好 🌞`;
  if (hours >= 14 && hours <= 18) return `Good afternoon 🌞`;
  if (hours >= 18 && hours <= 24) return `Good evening 🌛`;
  if (hours >= 0 && hours <= 6) return `Good morning 🌛`;
}

/**
 * @description Get browser default language
 * @return string
 */
export function getBrowserLang() {
  let browserLang = navigator.language ? navigator.language : navigator.browserLanguage;
  let defaultBrowserLang = "";
  if (browserLang.toLowerCase() === "cn" || browserLang.toLowerCase() === "zh" || browserLang.toLowerCase() === "zh-cn") {
    defaultBrowserLang = "zh";
  } else {
    defaultBrowserLang = "en";
  }
  return defaultBrowserLang;
}

/**
 * @description Recursively query the route corresponding to the current route
 * @param {Array} menuList All Menu List
 * @param {String} path Current Access Address
 * @return array
 */
export function filterCurrentRoute(menuList: Menu.MenuOptions[], path: string) {
  let result = {};
  for (let item of menuList) {
    if (item.path === path) return item;
    if (item.children) {
      const res = filterCurrentRoute(item.children, path);
      if (Object.keys(res).length) result = res;
    }
  }
  return result;
}

/**
 * @description Flattening array objects(Mainly used to handle the routing menu)
 * @param {Array} menuList All Menu List
 * @return array
 */
export function getFlatArr(menuList: Menu.MenuOptions[]) {
  let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
  return newMenuList.reduce((pre: Menu.MenuOptions[], current: Menu.MenuOptions) => {
    let flatArr = [...pre, current];
    if (current.children) flatArr = [...flatArr, ...getFlatArr(current.children)];
    return flatArr;
  }, []);
}

/**
 * @description Use递归，Filtering routes that need to be cached
 * @param {Array} menuList 所有菜单column表
 * @param {Array} cacheArr Cached Routing Menu name ['**','**']
 * @return array
 * */
export function getKeepAliveRouterName(menuList: Menu.MenuOptions[], keepAliveArr: string[] = []) {
  menuList.forEach(item => {
    item.meta.isKeepAlive && item.name && keepAliveArr.push(item.name);
    item.children?.length && getKeepAliveRouterName(item.children, keepAliveArr);
  });
  return keepAliveArr;
}

/**
 * @description Use递归，Filter out the list that needs to be rendered in the left menu（Remove isHide == true The menu of）
 * @param {Array} menuList All Menu List
 * @return array
 * */
export function getShowMenuList(menuList: Menu.MenuOptions[]) {
  let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList));
  return newMenuList.filter(item => {
    item.children?.length && (item.children = getShowMenuList(item.children));
    return !item.meta?.isHide;
  });
}

/**
 * @description Using recursionProcessing路由菜单 path，Generate a one-dimensional array(The first version of ground route authentication will use)
 * @param {Array} menuList All Menu List
 * @param {Array} menuPathArr One-dimensional array of menu addresses ['**','**']
 * @return array
 */
export function getMenuListPath(menuList: Menu.MenuOptions[], menuPathArr: string[] = []) {
  menuList.forEach((item: Menu.MenuOptions) => {
    typeof item === "object" && item.path && menuPathArr.push(item.path);
    item.children?.length && getMenuListPath(item.children, menuPathArr);
  });
  return menuPathArr;
}

/**
 * @description Using recursion，Filter out the breadcrumb addresses that match the current path
 * @param {String} path Current Access Address
 * @param {Array} menuList All Menu List
 * @returns array
 */
export function getCurrentBreadcrumb(path: string, menuList: Menu.MenuOptions[]) {
  let tempPath: Menu.MenuOptions[] = [];
  try {
    const getNodePath = (node: Menu.MenuOptions) => {
      tempPath.push(node);
      if (node.path === path) throw new Error("Find IT!");
      if (node.children?.length) node.children.forEach(item => getNodePath(item));
      tempPath.pop();
    };
    menuList.forEach(item => getNodePath(item));
  } catch (e) {
    return tempPath;
  }
}

/**
 * @description Double recursive to find all breadcrumbs stored in pinia/vuex 中
 * @param {Array} menuList All Menu List
 * @returns array
 */
export function getAllBreadcrumbList(menuList: Menu.MenuOptions[]) {
  let handleBreadcrumbList: { [key: string]: any } = {};
  const loop = (menuItem: Menu.MenuOptions) => {
    if (menuItem?.children?.length) menuItem.children.forEach(item => loop(item));
    handleBreadcrumbList[menuItem.path] = getCurrentBreadcrumb(menuItem.path, menuList);
  };
  menuList.forEach(item => loop(item));
  return handleBreadcrumbList;
}

/**
 * @description Formatting table cell defaults(el-table-column)
 * @param {Number} row line
 * @param {Number} col 列
 * @param {String} callValue Current cell value
 * @return string
 * */
export function defaultFormat(row: number, col: number, callValue: any) {
  // If the current value is an array,使用 / Splicing（Customized according to requirements）
  if (isArray(callValue)) return callValue.length ? callValue.join(" / ") : "--";
  return callValue ?? "--";
}

/**
 * @description Processing无数据情况
 * @param {String} callValue Values to be processed
 * @return string
 * */
export function formatValue(callValue: any) {
  // 如果Current值为数组,使用 / Splicing（Customized according to requirements）
  if (isArray(callValue)) return callValue.length ? callValue.join(" / ") : "--";
  return callValue ?? "--";
}

/**
 * @description 处理 prop for the case of multi-level nesting(The list is as follows: prop:user.name)
 * @param {Object} row Current row data
 * @param {String} prop 当前 prop
 * @return any
 * */
export function handleRowAccordingToProp(row: { [key: string]: any }, prop: string) {
  if (!prop.includes(".")) return row[prop];
  prop.split(".").forEach(item => {
    row = row[item] ?? "--";
  });
  return row;
}

/**
 * @description 处理 prop，当 prop For multi-level nesting ==> Back to the last level prop
 * @param {String} prop 当前 prop
 * @return string
 * */
export function handleProp(prop: string) {
  const propArr = prop.split(".");
  if (propArr.length == 1) return prop;
  return propArr[propArr.length - 1];
}

/**
 * @description 根据Enumeration List查询当需要的数据（If you specify label and value 的 key值，Automatically recognizes formatting）
 * @param {String} callValue Current cell value
 * @param {Array} enumData 枚举列表
 * @param {String} type Filter Type（Currently only tag）
 * @return string
 * */
export function filterEnum(
  callValue: any,
  enumData: { [key: string]: any } | undefined,
  searchProps?: { [key: string]: any },
  type?: string
): string {
  const value = searchProps?.value ?? "value";
  const label = searchProps?.label ?? "label";
  const childrenKey = searchProps?.childrenKey ?? "children";
  let filterData: any = {};
  // if (Array.isArray(enumData)) filterData = enumData.find((item: any) => item[value] === callValue);
  if (Array.isArray(enumData)) filterData = findItemNested(enumData, value, callValue, childrenKey);
  if (type == "tag") return filterData?.tagType ? filterData.tagType : "";
  return filterData ? filterData[label] : "--";
}

export function findItemNested(arr: any, itemKey: string, itemValue: any, nestingKey: string) {
  return arr.reduce((a: any, item: any) => {
    if (a) return a;
    if (item[itemKey] === itemValue) return item;
    if (item[nestingKey]) return findItemNested(item[nestingKey], itemKey, itemValue, nestingKey);
  }, null);
}
