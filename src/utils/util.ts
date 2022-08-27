import { isArray } from "@/utils/is";

/**
 * @description Get LocalStorage
 * @param {String} key Storage name
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
 * @description Store LocalStorage
 * @param {String} key Storage name
 * @param {Any} value Storage value
 * @return void
 */
export function localSet(key: string, value: any) {
	window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * @description Clear LocalStorage
 * @param {String} key Storage name
 * @return void
 */
export function localRemove(key: string) {
	window.localStorage.removeItem(key);
}

/**
 * @description Clear all localstorage
 * @return void
 */
export function localClear() {
	window.localStorage.clear();
}

/**
 * @description Object number group deep cloning
 * @param {Object} obj Source
 * @return object
 */
export function deepCopy<T>(obj: any): T {
	let newObj: any;
	try {
		newObj = obj.push ? [] : {};
	} catch (error) {
		newObj = {};
	}
	for (let attr in obj) {
		if (typeof obj[attr] === "object") {
			newObj[attr] = deepCopy(obj[attr]);
		} else {
			newObj[attr] = obj[attr];
		}
	}
	return newObj;
}

/**
 * @description Judgment data type
 * @param {Any} val Need to judge type data
 * @return string
 */
export function isType(val: any) {
	if (val === null) return "null";
	if (typeof val !== "object") return typeof val;
	else return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase();
}

/**
 * @description Generate random number
 * @param {Number} min Minimum
 * @param {Number} max Maximum
 * @return number
 */
export function randomNum(min: number, max: number): number {
	let num = Math.floor(Math.random() * (min - max) + max);
	return num;
}

/**
 * @description Get the default language of the browser
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
 * @description Recursive query current routing corresponding to the current routing
 * @param {Array} menuList Menu list
 * @param {String} path Current address
 * @return array
 */
export function getTabPane<T, U>(menuList: any[], path: U): T {
	let result: any;
	for (let item of menuList || []) {
		if (item.path === path) result = item;
		const res = getTabPane(item.children, path);
		if (res) result = res;
	}
	return result;
}

/**
 * @description Use recursively processing routing menu to generate a one -dimensional array
 * @param {Array} menuList All menu lists
 * @param {Array} newArr One -dimensional array of menu
 * @return array
 */
export function handleRouter(routerList: Menu.MenuOptions[], newArr: string[] = []) {
	routerList.forEach((item: Menu.MenuOptions) => {
		typeof item === "object" && item.path && newArr.push(item.path);
		item.children && item.children.length && handleRouter(item.children, newArr);
	});
	return newArr;
}

/**
 * @description Flat array object
 * @param {Array} arr Array object
 * @return array
 */
export function getFlatArr(arr: any) {
	return arr.reduce((pre: any, current: any) => {
		let flatArr = [...pre, current];
		if (current.children) flatArr = [...flatArr, ...getFlatArr(current.children)];
		return flatArr;
	}, []);
}

/**
 * @description Format form unit grid default value
 * @param {Number} row Row
 * @param {Number} col List
 * @param {String} callValue The current unit value
 * @return string
 * */
export function defaultFormat(row: number, col: number, callValue: any) {
	// If the current value is a array, use / splices (customized according to needs)
	if (isArray(callValue)) return callValue.length ? callValue.join(" / ") : "--";
	return callValue ?? "--";
}

/**
 * @description Treatment of unexplained situations
 * @param {String} callValue The value that needs to be processed
 * @return string
 * */
export function formatValue(callValue: any) {
	// If the current value is array,use / Stitching (customized according to needs)
	if (isArray(callValue)) return callValue.length ? callValue.join(" / ") : "--";
	return callValue ?? "--";
}

/**
 * @description According to the data required by the enumeration list (if the key value of Label and Value is specified, it will automatically identify formatting)
 * @param {String} callValue The current unit value
 * @param {Array} enumData Enumeration list
 * @param {String} type Filter type (currently only tag)
 * @return string
 * */
export function filterEnum(callValue: any, enumData: any, searchProps?: { [key: string]: any }, type?: string): string {
	const value = searchProps?.value ?? "value";
	const label = searchProps?.label ?? "label";
	// let filterData = enumData.find((item: any) => item[value] === callValue);
	let filterData: any = {};
	if (Array.isArray(enumData)) filterData = enumData.find((item: any) => item[value] === callValue);
	if (type == "tag") return filterData?.tagType ? filterData.tagType : "";
	return filterData ? filterData[label] : "--";
}

/**
 * @description object assign with nested propertied without throwing out previous properties
 * https://stackoverflow.com/questions/41588068/object-assign-override-nested-property
 * @param {Object} target
 * @param {Object} sources list of sources to deep assign to target object
 * @return {Object}
 */
export function nestedObjectAssign(target: any, ...sources: any[]) {
	sources.forEach(source => {
		Object.keys(source).forEach(key => {
			const s_val = source[key];
			const t_val = target[key];
			target[key] =
				t_val && s_val && typeof t_val === "object" && typeof s_val === "object" ? nestedObjectAssign(t_val, s_val) : s_val;
		});
	});
	return target;
}
