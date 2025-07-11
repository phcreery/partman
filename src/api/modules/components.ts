import { arrayToTree } from "performant-array-to-tree"; // deprecated
// import { unflatten, flatten } from "un-flatten-tree";
import client, { tryCatchAsync } from "@/api";
import { nestedObjectAssign } from "@/utils/nestedObjectAssign";

import {
  ReqList,
  ResultData,
  ResList,
  Component,
  ComponentCategory,
  Footprint,
  FootprintCategory,
  Storage,
  StorageCategory,
  Project,
  ProjectComponents,
  ProjectBuilds,
  ComponentLog,
  User,
  Config,
  Backup,
  Health
} from "@/api/interface/index";

const emptyData = (params?: ReqList): ResList<null> => {
  return {
    page: params ? params.page : 0,
    perPage: params ? params.perPage : 25,
    totalPages: 0,
    totalItems: 0,
    items: []
  };
};

/* 
function that converts JSON object of parameters to a consumable PocketBase 'filter' string.
ex. filter: { id: 'asdf', footprint: {0: '0806', 1: '0604'}} -> "id='asdf' && (footprint='0806' || footprint='0604')"
*/
const filterToPBString = (filter: { [propName: string]: any }) => {
  // console.log("filter", filter);
  let filterParams = Object.keys(filter);
  let sarr: string[] = []; // string array
  for (const param of filterParams) {
    if (param === "created" || param === "updated") {
      sarr.push(`${param}>='${filter[param][0]}' && ${param}<='${filter[param][1]}'`);
      // console.log(param, filter[param], sarr);
    } else if (typeof filter[param] === "object") {
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
  // console.log("filter string", s);
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
    return path.reverse().join(" ▸ "); // / > ‣ → ▻ ▸ ▶ ▷
  }
  return getPathName(data, parent[identifier], identifier, parentIdentifier, path);
};

export const buildUrl = (path: string) => {
  return client.buildUrl(path);
};

export const getFileUrl = (record: any, name: string, queryParams?: {} | undefined) => {
  return client.getFileUrl(record, name, queryParams);
};

// ---- COMPONENTS ----

export const getComponentList = async (params: Component.ReqGetComponentListParams) => {
  let res = await client.collection("components").getList(params.page, params.perPage, {
    // filter: Object.keys(params.filter).length !== 0 ? params.filter : "",
    filter: params.filter ? filterToPBString(params.filter) : "",
    sort: params.sort ?? "",
    expand: params.expand ?? "", // Default expand all???
    $autoCancel: false
  });
  return res as unknown as ResList<Component.ResGetComponentRecord>;
};

export const getComponentsListForExport = async (params: Component.ReqGetComponentListForExportParams) => {
  let res = await getComponentList({
    page: 1,
    perPage: 9999,
    filter: params.filter,
    expand: "",
    sort: ""
  });
  return res.items as unknown as Component.ResGetComponentRecord[];
};

export const deleteComponent = async (params: Component.ReqDeleteComponentParams) => {
  await client.collection("components").delete(params.id);
};

export const postComponentCreate = async (params: Component.ReqCreateComponentParams) => {
  let record = await client.collection("components").create(params);
  return { data: record } as unknown as Component.ResGetComponentRecord;
};

export const patchComponentUpdate = async (params: Component.ReqUpdateComponentParams, id?: string) => {
  let record = await client.collection("components").update(id ?? params.id, params);
  return { data: record } as unknown as Component.ResGetComponentRecord;
};

// TODO: convert this to a backend function
export const deleteComponents = async (params: Component.ReqDeleteComponentsParams) => {
  // TODO: speed this up??
  for (const id of params.ids) {
    await client.collection("components").delete(id);
  }
  return true;
};

export const getComponentEnum = async () => {
  // TODO: use pb.collection('example').getFullList();
  let [res, err] = await tryCatchAsync(() => client.collection("components").getList(1, 99999, { $autoCancel: false }));
  if (err) {
    console.error("getCompEnum res err", res, err);
    // return false;
  }
  // res.items.forEach((component: ComponentCategory.ResGetComponentCategoryRecord) => {
  // 	component._fullName = getPathName(res.items, component.id);
  // });
  return res.items as Component.ResGetComponentRecord[];
};

export const getComponent = async (id: string) => {
  let res = await client.collection("components").getOne(id);
  return res as unknown as Component.ResGetComponentRecord;
};

export const postComponentsUpload = async (params: any) => {
  let res = await client.send("/api/custom/importcomponents", {
    method: "POST",
    body: { data: params }
  });
  return res;
};

// ---- COMPONENT CATEGORIES ----

export const postComponentCategoryCreate = async (params: ComponentCategory.ReqCreateComponentCategoryParams) => {
  let record = await client.collection("component_categories").create(params);
  return record as unknown as ComponentCategory.ResGetComponentCategoryRecord;
};

export const patchComponentCategoryUpdate = async (params: ComponentCategory.ReqUpdateComponentCategoryParams) => {
  let record = await client.collection("component_categories").update(params.id, params);
  return record as unknown as Component.ResGetComponentRecord;
};

export const deleteComponentCategories = async (params: ComponentCategory.ReqDeleteComponentCategoriesParams) => {
  // TODO: speed this up??
  for (const id of params.ids) {
    await client.collection("component_categories").delete(id);
  }
  return true;
};

export const getComponentCategoryEnum = async () => {
  let [res, err] = await tryCatchAsync(() => client.collection("component_categories").getList(1, 99999, { $autoCancel: false }));
  if (err) {
    console.error("getCompCatEnum res err", res, err);
    // return false;
  }
  res.items.forEach((component: ComponentCategory.ResGetComponentCategoryRecord) => {
    component._fullName = getPathName(res.items, component.id);
  });
  return res.items as unknown as ComponentCategory.ResGetComponentCategoryRecord[];
};

export const getComponentCategoryEnumTree = async () => {
  let res = await getComponentCategoryEnum();
  const tree = arrayToTree(res, { id: "id", parentId: "parent", dataField: null });
  return tree as unknown as ComponentCategory.ResGetComponentCategoryRecordTree[];
};

// ---- FOOTPRINTS ----

export const getFootprintList = async (params: Footprint.ReqGetFootprintListParams) => {
  let res = await client.collection("footprints").getList(params.page, params.perPage, {
    filter: params.filter ? filterToPBString(params.filter) : "",
    sort: params.sort ?? "",
    expand: params.expand ?? ""
  });
  return res as unknown as ResList<Footprint.ResGetFootprintRecord>;
};

export const getFootprintsEnum = async () => {
  let res = await client.collection("footprints").getList(1, 99999, {});
  return res.items as unknown as Footprint.ResGetFootprintRecord[];
};

export const postFootprintCreate = async (params: Footprint.ReqCreateFootprintParams) => {
  let record = await client.collection("footprints").create(params);
  return record as unknown as Footprint.ResGetFootprintRecord;
};

export const patchFootprintUpdate = async (params: Footprint.ReqUpdateFootprintParams) => {
  let record = await client.collection("footprints").update(params.id, params);
  return record as unknown as Footprint.ResGetFootprintRecord;
};

export const deleteFootprints = async (params: Footprint.ReqDeleteFootprintsParams) => {
  // TODO: speed this up??
  for (const id of params.ids) {
    await client.collection("footprints").delete(id);
  }
  return true;
};

// ---- FOOTPRINT CATEGORY ----

export const postFootprintCategoryCreate = async (params: FootprintCategory.ReqCreateFootprintCategoryParams) => {
  let record = await client.collection("footprint_categories").create(params);
  return record as unknown as FootprintCategory.ResGetFootprintCategoryRecord;
};

export const patchFootprintCategoryUpdate = async (params: FootprintCategory.ReqUpdateFootprintCategoryParams) => {
  let record = await client.collection("footprint_categories").update(params.id, params);
  return record as unknown as Footprint.ResGetFootprintRecord;
};

export const deleteFootprintCategories = async (params: FootprintCategory.ReqDeleteFootprintCategoriesParams) => {
  // TODO: speed this up??
  for (const id of params.ids) {
    await client.collection("footprint_categories").delete(id);
  }
  return true;
};

export const getFootprintCategoryEnum = async () => {
  let [res, err] = await tryCatchAsync(() => client.collection("footprint_categories").getList(1, 99999, { $autoCancel: false }));
  if (err) {
    console.error("getFootprintCatEnum res err", res, err);
    // return false;
  }
  res.items.forEach((footprint: FootprintCategory.ResGetFootprintCategoryRecord) => {
    footprint._fullName = getPathName(res.items, footprint.id);
  });
  return res.items as unknown as FootprintCategory.ResGetFootprintCategoryRecord[];
};

export const getFootprintCategoryEnumTree = async () => {
  let res = await getFootprintCategoryEnum();
  const tree = arrayToTree(res, { id: "id", parentId: "parent", dataField: null });
  return tree as unknown as FootprintCategory.ResGetFootprintCategoryRecordTree[];
};

// ---- STORAGE LOCATIONS ----

export const getComponentStorageLocationEnum = async () => {
  let res = await client.collection("storage_locations").getList(1, 99999, { $autoCancel: false });
  return res.items as unknown as Storage.ResGetStorageRecord[];
};

export const getStorageList = async (params: Storage.ReqGetStorageListParams) => {
  let res = await client.collection("storage_locations").getList(params.page, params.perPage, {
    filter: params.filter ? filterToPBString(params.filter) : "",
    sort: params.sort ?? "",
    expand: params.expand ?? ""
  });
  return res as unknown as ResList<Storage.ResGetStorageRecord>;
};

export const postStorageCreate = async (params: Storage.ReqCreateStorageParams) => {
  let record = await client.collection("storage_locations").create(params);
  return record as unknown as Storage.ResGetStorageRecord;
};

export const patchStorageUpdate = async (params: Storage.ReqUpdateStorageParams) => {
  let record = await client.collection("storage_locations").update(params.id, params);
  return record as unknown as Storage.ResGetStorageRecord;
};

export const deleteStorages = async (params: Storage.ReqDeleteStoragesParams) => {
  // TODO: speed this up??
  for (const id of params.ids) {
    await client.collection("storage_locations").delete(id);
  }
  return true;
};

// Special case for storage locations, we need to get the full path name
export const getStorageLocationPathEnum = async () => {
  let storage_locations = (await getComponentStorageLocationEnum()) as (Storage.ResGetStorageRecord & {
    parent: string;
    _fullName: string;
    disabled: boolean;
  })[];
  let storage_categories = (await getStorageCategoryEnum()) as (StorageCategory.ResGetStorageCategoryRecord & {
    disabled: boolean;
  })[];
  // Since the storage locations are separate from storage categories, we need to merge them into a single array/tree
  // change category key of each storage_locations to parent
  storage_locations.forEach((storage_location: Storage.ResGetStorageRecord & { parent: string; disabled: boolean }) => {
    storage_location.parent = storage_location.category;
    storage_location.disabled = false;
  });
  storage_categories.forEach((storage_category: StorageCategory.ResGetStorageCategoryRecord & { disabled: boolean }) => {
    storage_category.disabled = true;
  });
  storage_categories.push(...storage_locations);
  storage_categories.forEach((storage_location: StorageCategory.ResGetStorageCategoryRecord) => {
    storage_location._fullName = getPathName(storage_categories, storage_location.id);
  });
  return storage_categories as unknown as Storage.ResGetStorageRecord[];
};

export const getStorageLocationPathEnumTree = async () => {
  // The EnumTree is used primarily for tree-selects
  let storage_locations = await getStorageLocationPathEnum();
  const tree = arrayToTree(storage_locations, { id: "id", parentId: "parent", dataField: null });
  return tree as unknown as Storage.ResGetStorageRecordTree[];
};

// ---- STORAGE CATEGORY ----

export const postStorageCategoryCreate = async (params: StorageCategory.ReqCreateStorageCategoryParams) => {
  let record = await client.collection("storage_categories").create(params);
  return record as unknown as StorageCategory.ResGetStorageCategoryRecord;
};

export const patchStorageCategoryUpdate = async (params: StorageCategory.ReqUpdateStorageCategoryParams) => {
  let record = await client.collection("storage_categories").update(params.id, params);
  return record as unknown as Storage.ResGetStorageRecord;
};

export const deleteStorageCategories = async (params: StorageCategory.ReqDeleteStorageCategoriesParams) => {
  // TODO: speed this up??
  for (const id of params.ids) {
    await client.collection("storage_categories").delete(id);
  }
  return true;
};

export const getStorageCategoryEnum = async () => {
  let [res, err] = await tryCatchAsync(() => client.collection("storage_categories").getList(1, 99999, { $autoCancel: false }));
  if (err) {
    console.error("getStorageCatEnum res err", res, err);
    // return false;
  }
  res.items.forEach((storage_location: StorageCategory.ResGetStorageCategoryRecord) => {
    storage_location._fullName = getPathName(res.items, storage_location.id);
  });
  return res.items as unknown as StorageCategory.ResGetStorageCategoryRecord[];
};

export const getStorageCategoryEnumTree = async () => {
  let res = await getStorageCategoryEnum();
  const tree = arrayToTree(res, { id: "id", parentId: "parent", dataField: null });
  return tree as unknown as StorageCategory.ResGetStorageCategoryRecordTree[];
};

// ---- PROJECTS ----

export const getProjectList = async (params: Project.ReqGetProjectListParams) => {
  let res = await client.collection("projects").getList(params.page, params.perPage, {
    filter: params.filter ? filterToPBString(params.filter) : "",
    sort: params.sort ?? "",
    expand: params.expand ?? ""
  });
  return res as unknown as ResList<Project.ResGetProjectRecord>;
};

export const getProjectListForEnum = async () => {
  let res = await client.collection("projects").getList(1, 99999, {});
  return res.items as unknown as Project.ResGetProjectRecord[];
};

export const getProjectsEnum = async () => {
  let res = await client.collection("projects").getList(1, 99999, {});
  return res.items as unknown as Project.ResGetProjectRecord[];
};

export const postProjectCreate = async (params: Project.ReqCreateProjectParams) => {
  let record = await client.collection("projects").create(params);
  return record as unknown as Project.ResGetProjectRecord;
};

export const patchProjectUpdate = async (params: Project.ReqUpdateProjectParams) => {
  const record = await client.collection("projects").update(params.id, params);
  return record as unknown as Project.ResGetProjectRecord;
};

export const deleteProjects = async (params: Project.ReqDeleteProjectsParams) => {
  // TODO: speed this up??
  for (const id of params.ids) {
    await client.collection("projects").delete(id);
  }
  return true;
};

// ---- PROJECT COMPONENTS ----

export const getProjectComponentsList = async (params: ProjectComponents.ReqGetProjectComponentListParams) => {
  if (params.projectID === "") return emptyData(params) as unknown as ResList<ProjectComponents.ResGetProjectComponentRecord>;
  let res_project = (await client.collection("projects").getOne(params.projectID, {})) as unknown as Project.ResGetProjectRecord;

  if (res_project.components.length === 0) res_project.components = ["none"]; // TODO: should be `= []` ?

  let filter: object = {};
  nestedObjectAssign(filter, res_project.components ? { id: res_project.components } : {});
  nestedObjectAssign(filter, params.filter?.bom_id ? { bom_id: params.filter?.bom_id } : {});
  nestedObjectAssign(filter, params.filter?.component ? { component: params.filter?.component } : {});
  nestedObjectAssign(filter, params.filter?.refdesignators ? { refdesignators: params.filter?.refdesignators } : {});

  let res_project_components = (await client.collection("project_components").getList(params.page, params.perPage, {
    filter: filterToPBString(filter),
    sort: params.sort ?? "",
    expand: "component" // params.expand ?? "",
  })) as unknown as ResList<ProjectComponents.ResGetProjectComponentRecord>;

  let res = res_project_components;

  return res as unknown as ResList<ProjectComponents.ResGetProjectComponentRecord>;
};

export const getProjectComponentsListForExport = async (params: ProjectComponents.ReqGetProjectComponentListForExportParams) => {
  if (params.projectID === "") return emptyData() as unknown as ResList<ProjectComponents.ResGetProjectComponentRecord>;
  let res = await getProjectComponentsList({
    page: 1,
    perPage: 9999,
    filter: params.filter ? params.filter : {},
    expand: "",
    sort: "",
    projectID: params.projectID
  });
  return res.items as unknown as ProjectComponents.ResGetProjectComponentRecord[];
};

export const postProjectComponentAdd = async (params: ProjectComponents.ReqAddProjectComponentParams) => {
  let res_project_components = await client.collection("project_components").create({
    bom_id: params.bom_id,
    component: params.component,
    quantity: params.quantity,
    refdesignators: params.refdesignators
  });

  let res_project = (await client
    .collection("projects")
    .getOne(params._ofProjectID, {})) as unknown as Project.ResGetProjectRecord;

  // append res_project_components.id to res_project.components
  res_project.components.push(res_project_components.id);

  const record = (await client
    .collection("projects")
    .update(params._ofProjectID, res_project)) as unknown as Project.ResGetProjectRecord;
  return record as unknown as ProjectComponents.ResGetProjectComponentRecord;
};

export const patchProjectComponentUpdate = async (params: ProjectComponents.ReqUpdateProjectComponentParams) => {
  const record = await client.collection("project_components").update(params.id, {
    bom_id: params.bom_id,
    component: params.component,
    quantity: params.quantity,
    refdesignators: params.refdesignators
  });
  return record as unknown as ProjectComponents.ResGetProjectComponentRecord;
};

export const deleteProjectComponents = async (params: ProjectComponents.ReqRemoveProjectComponentsParams) => {
  let res_project = (await client.collection("projects").getOne(params.projectID, {})) as unknown as Project.ResGetProjectRecord;
  for (const id of params.ids) {
    let index = res_project.components.findIndex(x => x == id);
    if (index !== -1) {
      res_project.components.splice(index, 1);
    }
    await client.collection("project_components").delete(id);
  }
  const record = await client.collection("projects").update(params.projectID, res_project);
  return record as unknown as Project.ResGetProjectRecord;
};

export const postProjectComponentsUpload = async (params: any) => {
  let res = await client.send("/api/custom/importprojectcomponents", {
    method: "POST",
    body: { data: params }
  });
  return res;
};

// ---- PROJECT BUILDS ----

export const getProjectBuildsList = async (params: ProjectBuilds.ReqGetProjectBuildListParams) => {
  let res = (await client.collection("project_builds").getList(params.page, params.perPage, {
    filter: params.filter ? filterToPBString(params.filter) : "",
    sort: params.sort ?? "",
    expand: params.expand ?? ""
  })) as unknown as ResList<ProjectBuilds.ResGetProjectBuildRecord>;
  return res as unknown as ResList<ProjectBuilds.ResGetProjectBuildRecord>;
};

export const getProjectBuildsListForExport = async (params: ProjectBuilds.ReqGetProjectBuildListForExportParams) => {
  let res = await getProjectBuildsList({
    page: 1,
    perPage: 9999,
    filter: params.filter,
    expand: "",
    sort: ""
  });
  return res.items as unknown as ProjectBuilds.ResGetProjectBuildRecord[];
};

export const postProjectBuildsCreate = async (params: ProjectBuilds.ReqCreateProjectBuildParams) => {
  let res = await client.collection("project_builds").create(params);
  await client.send(
    "/api/custom/projectbuilds/new?" +
      new URLSearchParams({
        project_id: params.project,
        qty: params.qty.toString()
      }),
    {
      method: "POST"
    }
  );
  return res as unknown as ProjectBuilds.ResGetProjectBuildRecord;
};

// export const postProjectBuildsRun = async (params: ProjectBuilds.ReqCreateProjectBuildParams) => {
//   let res = await client.collection("project_builds").create(params);
//   return { data: res } as unknown as ResultData<ProjectBuilds.ResGetProjectBuildRecord>;
// };

// ---- COMPONENT LOGS ----

export const getComponentLogsList = async (params: ComponentLog.ReqGetComponentLogListParams) => {
  let res = (await client.collection("component_log").getList(params.page, params.perPage, {
    filter: params.filter ? filterToPBString(params.filter) : "",
    sort: params.sort ?? "",
    expand: params.expand ?? ""
  })) as unknown as ResList<ComponentLog.ResGetComponentLogRecord>;
  return res as unknown as ResList<ComponentLog.ResGetComponentLogRecord>;
};

export const getComponentLogsListForExport = async (params: ComponentLog.ReqGetComponentLogListForExportParams) => {
  let res = await getComponentLogsList({
    page: 1,
    perPage: 9999,
    filter: params.filter,
    expand: "",
    sort: ""
  });
  return res.items as unknown as ComponentLog.ResGetComponentLogRecord[];
};

// ---- USERS ----

export const getUserList = async (params: User.ReqGetUserListParams) => {
  let res = await client.collection("users").getList(params.page, params.perPage, {
    filter: params.filter ? filterToPBString(params.filter) : "",
    sort: params.sort ?? "",
    expand: params.expand ?? "" // Default expand all???
  });
  return res as unknown as ResList<User.ResGetUserRecord>;
};

export const getUsersListForExport = async (params: User.ReqGetUserListForExportParams) => {
  let res = await getUserList({
    page: 1,
    perPage: 9999,
    filter: params.filter,
    expand: "",
    sort: ""
  });
  return res.items as unknown as User.ResGetUserRecord[];
};

export const getUser = async (params: User.ReqGetUserParams) => {
  let res = await client.collection("users").getOne(params.id);
  return res as unknown as User.ResGetUserRecord;
};

export const deleteUser = async (params: User.ReqDeleteUserParams) => {
  await client.collection("users").delete(params.id);
};

export const postUserCreate = async (params: User.ReqCreateUserParams) => {
  params.passwordConfirm = params.password; // PocketBase requires passwordConfirm to be the same as password
  let record = await client.collection("users").create(params);
  return record as unknown as User.ResGetUserRecord;
};

export const patchUserUpdate = async (params: User.ReqUpdateUserParams) => {
  console.log("patchUserUpdate", params);
  const record = await client.collection("users").update(params.id, params);
  return record as unknown as User.ResGetUserRecord;
};

export const deleteUsers = async (params: User.ReqDeleteUsersParams) => {
  // TODO: speed this up??
  for (const id of params.ids) {
    await client.collection("users").delete(id);
  }
  return true;
};

export const getUserEnum = async () => {
  let [res, err] = await tryCatchAsync(() => client.collection("users").getList(1, 99999, { $autoCancel: false }));
  if (err) {
    console.error("getUserEnum res err", res, err);
    // return false;
  }
  return res.items as unknown as User.ResGetUserRecord[];
};

// ---- SETTINGS/CONFIG ----

export const getConfig = async (params: Config.ReqGetConfigParams) => {
  let res = (await client.collection("config").getList()) as unknown as ResList<Config.ResGetConfigRecord>;
  let configRecord = res.items.find(record => record.category === params.category);
  return configRecord?.value as unknown as ResList<Config.ResGetConfigRecord>;
};

export const patchConfigUpdate = async (params: Config.ReqUpdateConfigParams) => {
  let res = (await client.collection("config").getList()) as unknown as ResList<Config.ResGetConfigRecord>;
  let configRecord = res.items.find(record => record.category === params.category);
  // create if not found
  if (!configRecord) {
    res = await client.collection("config").create({ category: params.category, value: params.value });
  }
  if (!configRecord?.id) {
    console.error("patchConfigUpdate configRecord?.id not found", configRecord);
    return false;
  }
  const record = await client.collection("config").update(configRecord?.id, params);
  return record as unknown as Config.ResGetConfigRecord;
};

// ---- DASHBOARD ----

export const getDashboardInfo = async () => {
  type DashboardInfo = {
    uniqueComponents: number;
    totalComponents: number;
    totalProjects: number;
    totalStorageLocations: number;
    totalProjectBuilds: number;
    components: Component.ResGetComponentRecord[];
    storageLocations: (Storage.ResGetStorageRecord & { numberOfComponents: number })[];
    storageLocationsTree: Storage.ResGetStorageRecordTree[];
    version: string;
  };

  let res = (await client.send("/api/custom/dashboard/info", {})) as unknown as ResultData<DashboardInfo>;

  let storageLocationsTree = await getStorageLocationPathEnumTree();
  let components = res.data.components;

  // iterate recursively and find each elements where child = [] and set value: 1
  async function iter(o: any, childKey: string, cb: (o: any) => void) {
    if (o[childKey] && o[childKey].length !== 0) {
      o[childKey].forEach((c: any) => iter(c, childKey, cb));
    } else {
      cb(o);
    }
  }
  for (const storageLocation of storageLocationsTree) {
    await iter(storageLocation, "children", (o: any) => {
      let foundComponents = components.filter((component: Component.ResGetComponentRecord) => component.storageLocation === o.id);
      o.value = foundComponents.length;
      o.numberOfComponents = foundComponents.length;
    });
  }
  res.data.storageLocationsTree = storageLocationsTree;
  return res.data as unknown as DashboardInfo;
};

// export const getDashboardComponentSupplyDemandRatio = async () => {
//   let components = await getComponentEnum();
//   let data = components.data.map((component: Component.ResGetComponentRecord) => {
//     let qty = 0;
//     component.projects.forEach((project: Project.ResGetProjectRecord) => {
//       let projectQty = project.quantity.find(x => x.id == component.id);
//       if (projectQty) {
//         qty += projectQty.quantity;
//       }
//     });
//     return { name: component.name, quantity: qty };
//   });
//   return { data: data } as unknown as ResultData<{ name: string; quantity: number }[]>;
// }

// ---- BACKUPS ----

export const getBackupsList = async () => {
  const backups = await client.backups.getFullList();
  return backups as unknown as Backup.ResGetBackupRecord[];
};

export const postBackupCreate = async (params: Backup.ReqCreateBackupParams) => {
  const name = params.name ? params.name : "";
  const backup = await client.backups.create(name);
  return backup as unknown as Backup.ResGetBackupRecord;
};

export const deleteBackup = async (params: Backup.ReqDeleteBackupParams) => {
  await client.backups.delete(params.key);
};

export const postBackupRestore = async (params: Backup.ReqRestoreBackupParams) => {
  await client.backups.restore(params.key);
};

// ---- HEALTH ----

export const getHealth = async () => {
  let res = (await client.send("/api/health", {})) as unknown as Health.ResHealth;
  console.log("getHealth", res);
  return res as unknown as Health.ResHealth;
};
