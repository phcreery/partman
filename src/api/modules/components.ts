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
  Project,
  User
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

export const getComponentsListForExport = async (params: Component.ReqGetComponentListForExportParams) => {
  let res = await getComponentList({
    page: 1,
    perPage: 999,
    filter: params.filter,
    expand: "",
    sort: ""
  });
  return res.data.items as unknown as Component.ResGetComponentRecord[];
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

export const getComponentEnum = async () => {
  let [res, err] = await tryCatchAsync(() => client.records.getList("components", 1, 99999, { $autoCancel: false }));
  if (err) {
    console.log("getCompEnum res err", res, err);
    // return false;
  }
  // res.items.forEach((component: ComponentCategory.ResGetComponentCategoryRecord) => {
  // 	component._fullName = getPathName(res.items, component.id);
  // });
  return { data: res.items } as unknown as APIdata<Component.ResGetComponentRecord[]>;
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
  // if no project ID specified, return empty data set
  if (params.projectID === "") return { data: {} } as unknown as APIdata<ResList<Project.ResGetProjectComponentRecord>>;

  let res_project = (await client.records.getOne("projects", params.projectID, {
    // expand: "components" // depreciated
  })) as unknown as Project.ResGetProjectRecord;
  if (typeof res_project.quantity !== "object" || res_project.quantity === null || res_project.quantity.length === 0)
    return { data: {} } as unknown as APIdata<ResList<Project.ResGetProjectComponentRecord>>;
  // let componentsFilter = { id: { ...res_project.components } }; // convert array of ids to { 0: id1, 1: id2, ... } // depreciated
  // let componentsFilter = { id: { ...Object.keys(res_project.quantity) } }; // convert array of { [id]: qty } to { 0: id1, 1: id2, ... } to { 0: id1, 1: id2, ... } // Type 1
  let componentsFilter = { id: { ...res_project.quantity.map(c => c.id) } }; // convert array of objects with [{ id: "", qty: # }, ...] to [ id1, id1, ... ] to { 0: id1, 1: id2, ... } // Type 2
  let filter = params.filter;
  // filter out entire component list by those found in specified project
  nestedObjectAssign(filter, componentsFilter);
  let res_components = (await client.records.getList("components", 1, 99999, {
    filter: filterToPBString(componentsFilter),
    sort: params.sort ?? "",
    expand: params.expand ?? "" // TODO: use params expand
  })) as unknown as ResList<Project.ResGetProjectComponentRecord>;
  // go through and add quantity used in project to each component
  await res_components.items.forEach(function (cInProj, index, theArray) {
    // theArray[index]._quantityUsed = res_project.quantity[cInProj.id]; // Type 1
    theArray[index]._quantityUsed = Number(res_project.quantity.find(c => c.id === cInProj.id)?.quantity); // Type 2
    theArray[index]._ofProjectID = res_project.id; // or params.projectID
  });
  return { data: res_components } as unknown as APIdata<ResList<Project.ResGetProjectComponentRecord>>;
};

export const getProjectComponentsListForExport = async (params: Project.ReqGetProjectComponentListForExportParams) => {
  let res = await getProjectComponentsList({
    page: 1,
    perPage: 999,
    filter: params.filter,
    expand: "",
    sort: "",
    projectID: params.projectID ?? ""
  });
  return res.data.items as unknown as Project.ResGetProjectComponentRecord[];
};

export const postProjectComponentAdd = async (params: Project.ReqAddProjectComponentParams) => {
  let res_project = (await client.records.getOne("projects", params._ofProjectID, {
    // expand: "components" // depreciated
  })) as unknown as Project.ResGetProjectRecord;

  // check if the quantity column is not empty (new project)
  if (typeof res_project.quantity === "object" && res_project.quantity !== null && Array.isArray(res_project.quantity)) {
    // check if the part is already added
    let index = res_project.quantity?.findIndex(x => x.id == params.id);
    if (index === -1) {
      // nestedObjectAssign(res_project, { quantity: { id: params.id, quantity: params._quantityUsed } });
      res_project.quantity.push({ id: params.id, quantity: params._quantityUsed });
    }
  } else {
    res_project.quantity = [{ id: params.id, quantity: params._quantityUsed }];
  }
  const record = await client.records.update("projects", params._ofProjectID, res_project);
  return { data: record } as unknown as APIdata<Project.ResGetProjectRecord>;
};

export const postProjectComponentUpdate = async (params: Project.ReqUpdateProjectComponentParams) => {
  let res_project = (await client.records.getOne("projects", params._ofProjectID, {
    // expand: "components" // depreciated
  })) as unknown as Project.ResGetProjectRecord;
  // nestedObjectAssign(res_project.quantity, { [params.id]: params._quantityUsed });
  // nestedObjectAssign(res_project, { quantity: { [params.id]: params._quantityUsed } }); // Type 1
  res_project.quantity[res_project.quantity.findIndex(x => x.id == params.id)] = {
    // Type 2
    id: params.id,
    quantity: params._quantityUsed
  };
  const record = await client.records.update("projects", params._ofProjectID, res_project);
  return { data: record } as unknown as APIdata<Project.ResGetProjectRecord>;
};

export const deleteProjectComponents = async (params: Project.ReqRemoveProjectComponentsParams) => {
  console.log("params", params);
  let res_project = (await client.records.getOne("projects", params.projectID, {
    // expand: "components" // depreciated
  })) as unknown as Project.ResGetProjectRecord;

  for (const id of params.ids) {
    let index = res_project.quantity.findIndex(x => x.id == id);
    if (index !== -1) {
      res_project.quantity.splice(index, 1);
    }
  }
  console.log("updating with", res_project);
  const record = await client.records.update("projects", params.projectID, res_project);
  // return true;
  return { data: record } as unknown as APIdata<Project.ResGetProjectRecord>;
};

// USERS

export const getUserList = async (params: User.ReqGetUserListParams) => {
  let res = await client.records.getList("profiles", params.page, params.perPage, {
    // filter: Object.keys(params.filter).length !== 0 ? params.filter : "",
    filter: filterToPBString(params.filter),
    sort: params.sort ?? "",
    expand: params.expand ?? "" // Default expand all???
  });
  return { data: res } as unknown as APIdata<ResList<User.ResGetUserRecord>>;
};

export const getUsersListForExport = async (params: User.ReqGetUserListForExportParams) => {
  let res = await getUserList({
    page: 1,
    perPage: 999,
    filter: params.filter,
    expand: "",
    sort: ""
  });
  return res.data.items as unknown as User.ResGetUserRecord[];
};

export const deleteUser = async (params: User.ReqDeleteUserParams) => {
  await client.records.delete("profiles", params.id);
};

export const postUserCreate = async (params: User.ReqCreateUserParams) => {
  let record = await client.records.create("profiles", params);
  return { data: record } as unknown as APIdata<User.ResGetUserRecord>;
};

export const patchUserUpdate = async (params: User.ReqUpdateUserParams) => {
  const record = await client.records.update("profiles", params.id, params);
  return { data: record } as unknown as APIdata<User.ResGetUserRecord>;
};

export const deleteUsers = async (params: User.ReqDeleteUsersParams) => {
  // TODO: speed this up??
  for (const id of params.ids) {
    await client.records.delete("profiles", id);
  }
  return true;
};

export const getUserEnum = async () => {
  let [res, err] = await tryCatchAsync(() => client.records.getList("profiles", 1, 99999, { $autoCancel: false }));
  if (err) {
    console.log("getCompEnum res err", res, err);
    // return false;
  }
  // res.items.forEach((component: UserCategory.ResGetUserCategoryRecord) => {
  // 	component._fullName = getPathName(res.items, component.id);
  // });
  return { data: res.items } as unknown as APIdata<User.ResGetUserRecord[]>;
};
