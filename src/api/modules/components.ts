import { arrayToTree } from "performant-array-to-tree";
import client, { tryCatchAsync } from "@/api";
import { nestedObjectAssign } from "@/utils/util";

import {
	APIdata,
	ResList,
	Component,
	ComponentCategory,
	Footprint,
	FootprintCategory,
	Storage,
	StorageCategory,
	Project
} from "@/api/interface/index";

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

export const postComponentCategoryCreate = async (params: ComponentCategory.ReqCreateComponentCategoryParams) => {
	let record = await client.records.create("component_categories", params);
	return { data: record } as unknown as APIdata<ComponentCategory.ResGetComponentCategoryRecord>;
};

export const patchComponentCategoryUpdate = async (params: ComponentCategory.ReqUpdateComponentCategoryParams) => {
	const record = await client.records.update("component_categories", params.id, params);
	return { data: record } as unknown as APIdata<Component.ResGetComponentRecord>;
};

export const deleteComponentCategories = async (params: ComponentCategory.ReqDeleteComponentCategoriesParams) => {
	// TODO: speed this up??
	for (const id of params.ids) {
		await client.records.delete("component_categories", id);
	}
	return true;
};

export const getComponentCategoryEnum = async () => {
	let [res, err] = await tryCatchAsync(() => client.records.getList("component_categories", 1, 99999, { $autoCancel: false }));
	if (err) {
		console.log("getCompCatEnum res err", res, err);
		// return false;
	}
	res.items.forEach((component: ComponentCategory.ResGetComponentCategoryRecord) => {
		component._fullName = getPathName(res.items, component.id);
	});
	return { data: res.items } as unknown as APIdata<ComponentCategory.ResGetComponentCategoryRecord[]>;
};

export const getComponentCategoryEnumTree = async () => {
	let [res, err] = await tryCatchAsync(() => client.records.getList("component_categories", 1, 99999, { $autoCancel: false }));
	if (err) {
		console.log("getCompCatEnum res err", res, err);
		// return false;
	}
	const tree = arrayToTree(res.items, { id: "id", parentId: "parent", dataField: null });
	return { data: tree } as unknown as APIdata<ComponentCategory.ResGetComponentCategoryRecordTree[]>;
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

// ---- STORAGE CATEGORY ----

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

// ---- PROJECTS ----

// export const getComponentCategoryEnum = async () => {
// 	let [res, err] = await tryCatchAsync(() => client.records.getList("component_categories", 1, 99999, { $autoCancel: false }));
// 	if (err) {
// 		console.log("getCompCatEnum res err", res, err);
// 		// return false;
// 	}
// 	res.items.forEach((component: ComponentCategory.ResGetComponentCategoryRecord) => {
// 		component._fullName = getPathName(res.items, component.id);
// 	});
// 	return { data: res.items } as unknown as APIdata<ComponentCategory.ResGetComponentCategoryRecord[]>;
// };

// export const getComponentCategoryEnumTree = async () => {
// 	let [res, err] = await tryCatchAsync(() => client.records.getList("component_categories", 1, 99999, { $autoCancel: false }));
// 	if (err) {
// 		console.log("getCompCatEnum res err", res, err);
// 		// return false;
// 	}
// 	const tree = arrayToTree(res.items, { id: "id", parentId: "parent", dataField: null });
// 	return { data: tree } as unknown as APIdata<ComponentCategory.ResGetComponentCategoryRecordTree[]>;
// };

export const getProjectList = async (params: Project.ReqGetProjectListParams) => {
	let res = await client.records.getList("projects", params.page, params.perPage, {
		// filter: params.filter ?? "",
		filter: filterToPBString(params.filter),
		sort: params.sort ?? "",
		expand: params.expand ?? ""
	});
	return { data: res } as unknown as APIdata<ResList<Project.ResGetProjectRecord>>;
};

export const getProjectsEnum = async () => {
	let res = await client.records.getList("projects", 1, 99999, {});
	return { data: res.items } as unknown as APIdata<Project.ResGetProjectRecord[]>;
};

export const postProjectCreate = async (params: Project.ReqCreateProjectParams) => {
	let record = await client.records.create("projects", params);
	return { data: record } as unknown as APIdata<Project.ResGetProjectRecord>;
};

export const patchProjectUpdate = async (params: Project.ReqUpdateProjectParams) => {
	const record = await client.records.update("projects", params.id, params);
	return { data: record } as unknown as APIdata<Project.ResGetProjectRecord>;
};

export const deleteProjects = async (params: Project.ReqDeleteProjectsParams) => {
	// TODO: speed this up??
	for (const id of params.ids) {
		await client.records.delete("projects", id);
	}
	return true;
};

// PROJECT COMPONENTS

// Type 1: [{"id": "a4bJqkHVdneg5As", "quantity": 2}, ...]
// Type 2: { "a4bJqkHVdneg5As": 2, ... }

export const getProjectComponentsList = async (params: Project.ReqGetProjectComponentListParams) => {
	if (params.projectID === "") return { data: {} };
	let res_project = (await client.records.getOne("projects", params.projectID, {
		expand: "components"
	})) as unknown as Project.ResGetProjectRecord;
	// let componentsFilter = { id: { ...res_project.components } }; // convert array of ids to { 0: id1, 1: id2, ... } // depreciated
	// let componentsFilter = { id: { ...Object.keys(res_project.quantity) } }; // convert array of { [id]: qty } to { 0: id1, 1: id2, ... } to { 0: id1, 1: id2, ... } // Type 1
	let componentsFilter = { id: { ...res_project.quantity.map(c => c.id) } }; // convert array of objects with [{ id: "", qty: # }, ...] to [ id1, id1, ... ] to { 0: id1, 1: id2, ... } // Type 2
	let filter = params.filter;
	// filter out entire component list by those found in specified project
	nestedObjectAssign(filter, componentsFilter);
	let res_components = await client.records.getList("components", 1, 99999, {
		filter: filterToPBString(componentsFilter),
		sort: params.sort ?? "",
		expand: params.expand ?? "" // TODO: use params expand
	});
	console.log("res_components", res_components);
	// go through and add quantity used in project to each component
	res_components.items.forEach(function (cInProj, index, theArray) {
		// theArray[index]._quantity_used = res_project.quantity[cInProj.id]; // Type 1
		theArray[index]._quantity_used = res_project.quantity.find(c => c.id === cInProj.id)?.quantity; // Type 2
		theArray[index]._of_project_id = res_project.id; // or params.projectID
	});
	console.log("res_components", res_components);
	return { data: res_components } as unknown as APIdata<ResList<Project.ResGetProjectComponentRecord>>;
};

export const postProjectComponentAdd = async (params: Project.ReqAddProjectComponentsParams) => {};

export const postProjectComponentUpdate = async (params: Project.ReqUpdateProjectComponentsParams) => {
	console.log("params", params);
	let res_project = (await client.records.getOne("projects", params._of_project_id, {
		// expand: "components"
	})) as unknown as Project.ResGetProjectRecord;
	console.log("before", res_project, params._quantity_used);
	// nestedObjectAssign(res_project.quantity, { [params.id]: params._quantity_used });
	// nestedObjectAssign(res_project, { quantity: { [params.id]: params._quantity_used } }); // Type 1
	res_project.quantity[res_project.quantity.findIndex(x => x.id == params.id)] = {
		// Type 2
		id: params.id,
		quantity: params._quantity_used
	};
	console.log("after", res_project);
	const record = await client.records.update("projects", params._of_project_id, res_project);
	return { data: record } as unknown as APIdata<Project.ResGetProjectRecord>;
};
