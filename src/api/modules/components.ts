import { arrayToTree } from "performant-array-to-tree";
import client, { tryCatchAsync } from "@/api";

import { ResList, Component, Footprint, ComponentCategory, Storage, FootprintCategory } from "@/api/interface/index";

type APIdata<T> = { data: T };

/* 
function that converts JSON object of parameters to a consumable PocketBase 'filter' string.
ex. filter: { id: 'asdf', footprint: {0: '0806', 1: '0604'}} -> "id='asdf' && (footprint='0806' || footprint='0604')"
*/
const filterToPBString = (filter: { [propName: string]: any }) => {
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
		return false;
	}
	res.items.forEach((component: ComponentCategory.ResGetCategoryRecord) => {
		component._fullName = getPathName(res.items, component.id);
	});
	console.log("categories with path", res.items);
	return { data: res.items } as unknown as APIdata<ComponentCategory.ResGetCategoryRecord[]>;
};

export const getComponentCategoryEnumTree = async () => {
	let [res, err] = await tryCatchAsync(() => client.records.getList("component_categories", 1, 99999, {}));
	if (err) {
		console.log("getCompCatEnum res err", res, err);
		return false;
	}
	const tree = arrayToTree(res.items, { id: "id", parentId: "parent", dataField: null }); // nest(res.items)
	console.log("tree", res.items, tree);
	return { data: tree };
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

export const deleteFootprints = async (params: Component.ReqDeleteFootprintsParams) => {
	// TODO: speed this up??
	for (const id of params.ids) {
		await client.records.delete("footprints", id);
	}
	return true;
};

// ---- FOOTPRINT CATEGORY ----

export const getFootprintCategoryEnumTree = async () => {
	let [res, err] = await tryCatchAsync(() => client.records.getList("footprint_categories", 1, 99999, {}));
	if (err) {
		console.log("error", res, err);
		return false;
	}
	const tree = arrayToTree(res.items, { id: "id", parentId: "parent", dataField: null }); // nest(res.items)
	console.log("tree", res.items, tree);
	return { data: tree };
};

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

// ---- STORAGE LOCATIONS ----

export const getComponentStorageLocationEnum = async () => {
	let res = await client.records.getList("storage_locations", 1, 99999, {});
	return { data: res.items } as unknown as APIdata<Storage.ResGetStorageRecord[]>;
};
