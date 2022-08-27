import { arrayToTree } from "performant-array-to-tree";
import client, { tryCatchAsync } from "@/api";

import {
	ResList,
	Component,
	ComponentCategory,
	Footprint,
	FootprintCategory,
	Storage,
	StorageCategory
} from "@/api/interface/index";

type APIdata<T> = { data: T };

/* 
function that converts JSON object of parameters to a consumable PocketBase 'filter' string.
ex. filter: { id: 'asdf', footprint: {0: '0806', 1: '0604'}} -> "id='asdf' && (footprint='0806' || footprint='0604')"
*/
const filterToPBString = (filter: { [propName: string]: any }) => {
	// console.log("filter", filter);
	let filterParams = Object.keys(filter);
	let sarr: string[] = []; // string array
	for (const param of filterParams) {
		if (typeof filter[param] === "object") {
			let lsarr: string[] = []; // local string array
			Object.keys(filter[param]).forEach(key => {
				lsarr.push(`${param}~'${filter[param][key]}'`);
			});
			if (lsarr.length > 0) sarr.push(`(${lsarr.join(" || ")})`);
		} else {
			sarr.push(`${param}~'${filter[param]}'`);
		}
	}
	let s = sarr.join(" && ");
	return s;
};

/* 
Function that converts a list of tree items that have 'parent id' relations and returns a full tree name for specified item
*/
const getPathName = (data: any[], id: string, identifier = "id", parentIdentifier = "parent", path: string[] = []): string => {
	const found = data.find(element => element[identifier] === id);
	path.push(found.name);
	const parent = data.find(element => element[identifier] === found[parentIdentifier]);
	if (!parent) {
		return path.reverse().join(" > ");
	}
	return getPathName(data, parent[identifier], identifier, parentIdentifier, path);
};

// ---- COMPONENTS ----

export const getComponentList = async (params: Component.ReqGetComponentListParams) => {
	let res = await client.records.getList("components", params.page, params.perPage, {
		// filter: Object.keys(params.filter).length !== 0 ? params.filter : "",
		filter: filterToPBString(params.filter),
		sort: params.sort ?? "",
		expand: params.expand ?? "" // Default expand all???
	});
	return { data: res } as unknown as APIdata<ResList<Component.ResGetComponentRecord>>;
};

export const deleteComponent = async (params: Component.ReqDeleteComponentParams) => {
	await client.records.delete("components", params.id);
};

export const postComponentCreate = async (params: Component.ReqCreateComponentParams) => {
	let record = await client.records.create("components", params);
	return { data: record } as unknown as APIdata<Component.ResGetComponentRecord>;
};

export const patchComponentUpdate = async (params: Component.ReqUpdateComponentParams) => {
	const record = await client.records.update("components", params.id, params);
	return { data: record } as unknown as APIdata<Component.ResGetComponentRecord>;
};

export const deleteComponents = async (params: Component.ReqDeleteComponentsParams) => {
	// TODO: speed this up??
	for (const id of params.ids) {
		await client.records.delete("components", id);
	}
	return true;
};

// ---- COMPONENT CATEGORIES ----

export const getComponentCategoryEnum = async () => {
	let [res, err] = await tryCatchAsync(() => client.records.getList("component_categories", 1, 99999, {}));
	if (err) {
		console.log("getCompCatEnum res err", res, err);
		// return false;
	}
	res.items.forEach((component: ComponentCategory.ResGetCategoryRecord) => {
		component._fullName = getPathName(res.items, component.id);
	});
	return { data: res.items } as unknown as APIdata<ComponentCategory.ResGetCategoryRecord[]>;
};

export const getComponentCategoryEnumTree = async () => {
	let [res, err] = await tryCatchAsync(() => client.records.getList("component_categories", 1, 99999, {}));
	if (err) {
		console.log("getCompCatEnum res err", res, err);
		// return false;
	}
	const tree = arrayToTree(res.items, { id: "id", parentId: "parent", dataField: null });
	return { data: tree } as unknown as APIdata<ComponentCategory.ResGetCategoryRecordTree[]>;
};

// ---- FOOTPRINTS ----

export const getFootprintList = async (params: Footprint.ReqGetFootprintListParams) => {
	let res = await client.records.getList("footprints", params.page, params.perPage, {
		// filter: params.filter ?? "",
		filter: filterToPBString(params.filter),
		sort: params.sort ?? "",
		expand: params.expand ?? ""
	});
	return { data: res } as unknown as APIdata<ResList<Footprint.ResGetFootprintRecord>>;
};

export const getFootprintsEnum = async () => {
	let res = await client.records.getList("footprints", 1, 99999, {});
	return { data: res.items } as unknown as APIdata<Footprint.ResGetFootprintRecord[]>;
};

export const postFootprintCreate = async (params: Footprint.ReqCreateFootprintParams) => {
	let record = await client.records.create("footprints", params);
	return { data: record } as unknown as APIdata<Footprint.ResGetFootprintRecord>;
};

export const patchFootprintUpdate = async (params: Footprint.ReqUpdateFootprintParams) => {
	const record = await client.records.update("footprints", params.id, params);
	return { data: record } as unknown as APIdata<Footprint.ResGetFootprintRecord>;
};

export const deleteFootprints = async (params: Footprint.ReqDeleteFootprintsParams) => {
	// TODO: speed this up??
	for (const id of params.ids) {
		await client.records.delete("footprints", id);
	}
	return true;
};

// ---- FOOTPRINT CATEGORY ----

export const postFootprintCategoryCreate = async (params: FootprintCategory.ReqCreateFootprintCategoryParams) => {
	let record = await client.records.create("footprint_categories", params);
	return { data: record } as unknown as APIdata<FootprintCategory.ResGetFootprintCategoryRecord>;
};

export const patchFootprintCategoryUpdate = async (params: FootprintCategory.ReqUpdateFootprintCategoryParams) => {
	const record = await client.records.update("footprint_categories", params.id, params);
	return { data: record } as unknown as APIdata<Footprint.ResGetFootprintRecord>;
};

export const deleteFootprintCategories = async (params: FootprintCategory.ReqDeleteFootprintCategoriesParams) => {
	// TODO: speed this up??
	for (const id of params.ids) {
		await client.records.delete("footprint_categories", id);
	}
	return true;
};

export const getFootprintCategoryEnum = async () => {
	let [res, err] = await tryCatchAsync(() => client.records.getList("footprint_categories", 1, 99999, { $autoCancel: false }));
	if (err) {
		console.log("getFootprintCatEnum res err", res, err);
		return false;
	}
	res.items.forEach((footprint: FootprintCategory.ResGetFootprintCategoryRecord) => {
		footprint._fullName = getPathName(res.items, footprint.id);
	});
	return { data: res.items } as unknown as APIdata<FootprintCategory.ResGetFootprintCategoryRecord[]>;
};

export const getFootprintCategoryEnumTree = async () => {
	let [res, err] = await tryCatchAsync(() => client.records.getList("footprint_categories", 1, 99999, { $autoCancel: false }));
	if (err) {
		console.log("error", res, err);
		return false;
	}
	const tree = arrayToTree(res.items, { id: "id", parentId: "parent", dataField: null });
	return { data: tree } as unknown as APIdata<FootprintCategory.ResGetFootprintCategoryRecordTree[]>;
};

// ---- STORAGE LOCATIONS ----

export const getComponentStorageLocationEnum = async () => {
	let res = await client.records.getList("storage_locations", 1, 99999, {});
	return { data: res.items } as unknown as APIdata<Storage.ResGetStorageRecord[]>;
};

export const getStorageList = async (params: Storage.ReqGetStorageListParams) => {
	let res = await client.records.getList("storage_locations", params.page, params.perPage, {
		// filter: params.filter ?? "",
		filter: filterToPBString(params.filter),
		sort: params.sort ?? "",
		expand: params.expand ?? ""
	});
	return { data: res } as unknown as APIdata<ResList<Storage.ResGetStorageRecord>>;
};

export const getStoragesEnum = async () => {
	let res = await client.records.getList("storage_locations", 1, 99999, {});
	return { data: res.items } as unknown as APIdata<Storage.ResGetStorageRecord[]>;
};

export const postStorageCreate = async (params: Storage.ReqCreateStorageParams) => {
	let record = await client.records.create("storage_locations", params);
	return { data: record } as unknown as APIdata<Storage.ResGetStorageRecord>;
};

export const patchStorageUpdate = async (params: Storage.ReqUpdateStorageParams) => {
	const record = await client.records.update("storage_locations", params.id, params);
	return { data: record } as unknown as APIdata<Storage.ResGetStorageRecord>;
};

export const deleteStorages = async (params: Storage.ReqDeleteStoragesParams) => {
	// TODO: speed this up??
	for (const id of params.ids) {
		await client.records.delete("storage_locations", id);
	}
	return true;
};

// ---- FOOTPRINT CATEGORY ----

export const postStorageCategoryCreate = async (params: StorageCategory.ReqCreateStorageCategoryParams) => {
	let record = await client.records.create("storage_categories", params);
	return { data: record } as unknown as APIdata<StorageCategory.ResGetStorageCategoryRecord>;
};

export const patchStorageCategoryUpdate = async (params: StorageCategory.ReqUpdateStorageCategoryParams) => {
	const record = await client.records.update("storage_categories", params.id, params);
	return { data: record } as unknown as APIdata<Storage.ResGetStorageRecord>;
};

export const deleteStorageCategories = async (params: StorageCategory.ReqDeleteStorageCategoriesParams) => {
	// TODO: speed this up??
	for (const id of params.ids) {
		await client.records.delete("storage_categories", id);
	}
	return true;
};

export const getStorageCategoryEnum = async () => {
	let [res, err] = await tryCatchAsync(() => client.records.getList("storage_categories", 1, 99999, { $autoCancel: false }));
	if (err) {
		console.log("getStorageCatEnum res err", res, err);
		return false;
	}
	res.items.forEach((footprint: StorageCategory.ResGetStorageCategoryRecord) => {
		footprint._fullName = getPathName(res.items, footprint.id);
	});
	return { data: res.items } as unknown as APIdata<StorageCategory.ResGetStorageCategoryRecord[]>;
};

export const getStorageCategoryEnumTree = async () => {
	let [res, err] = await tryCatchAsync(() => client.records.getList("storage_categories", 1, 99999, { $autoCancel: false }));
	if (err) {
		console.log("error", res, err);
		return false;
	}
	const tree = arrayToTree(res.items, { id: "id", parentId: "parent", dataField: null });
	return { data: tree } as unknown as APIdata<StorageCategory.ResGetStorageCategoryRecordTree[]>;
};
