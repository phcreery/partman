import { arrayToTree } from "performant-array-to-tree";
import client, { tryCatchAsync } from "@/api";
import { nestedObjectAssign } from "@/utils/nestedObjectAssign";

import {
  APIdata,
  ReqList,
  ResList,
  Component,
  ComponentCategory,
  Footprint,
  FootprintCategory,
  Storage,
  StorageCategory,
  Project,
  ProjectComponents,
  ComponentLog,
  User,
  Config
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
  console.log("filter", filter);
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
  console.log("filter string", s);
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

// ---- COMPONENTS ----

export const getComponentList = async (params: Component.ReqGetComponentListParams) => {
  console.log("getComponentList params", params);
  let res = await client.collection("components").getList(params.page, params.perPage, {
    // filter: Object.keys(params.filter).length !== 0 ? params.filter : "",
    filter: params.filter ? filterToPBString(params.filter) : "",
    sort: params.sort ?? "",
    expand: params.expand ?? "", // Default expand all???
    $autoCancel: false
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
  await client.collection("components").delete(params.id);
};

export const postComponentCreate = async (params: Component.ReqCreateComponentParams) => {
  let record = await client.collection("components").create(params);
  return { data: record } as unknown as APIdata<Component.ResGetComponentRecord>;
};

export const patchComponentUpdate = async (params: Component.ReqUpdateComponentParams) => {
  let record = await client.collection("components").update(params.id, params);
  return { data: record } as unknown as APIdata<Component.ResGetComponentRecord>;
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
    console.log("getCompEnum res err", res, err);
    // return false;
  }
  // res.items.forEach((component: ComponentCategory.ResGetComponentCategoryRecord) => {
  // 	component._fullName = getPathName(res.items, component.id);
  // });
  return { data: res.items } as unknown as APIdata<Component.ResGetComponentRecord[]>;
};

// TODO: convert this to a backend function
export const postComponentCreateBatch_Client = async (fd: FormData) => {
  // iterate over the parameter FormData file entries and create a new component using postComponentCreate for each entry
  for (let newfile of fd.getAll("file")) {
    let file = newfile as File;
    // read file if csv
    if (file.type === "text/csv") {
      // iterate over csv lines
      let text = await file.text();
      let lines = text.split("\n");
      for (let i = 1; i < lines.length; i++) {
        let line = lines[i];
        // let values = line.split(",");
        let values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        // let values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        values = values || [];
        let component: Component.ComponentColumns = {
          category: "", // values[0],
          manufacturer: values[1],
          mpn: values[2],
          description: values[3],
          stock: Number(values[4]),
          ipn: "", // values[5],
          storage_location: "", // values[6],
          comment: "",
          footprint: "",
          specs: [],
          supplier: "",
          spn: ""
        };
        // exit if no mpn
        if (!component.mpn) continue;

        // find storage location id with getComponentStorageLocationEnum
        let storageLocationEnum = await getComponentStorageLocationEnum();
        let storageLocation = storageLocationEnum.data.find((storageLocation: Storage.ResGetStorageRecord) => {
          return storageLocation.name === values[6];
        });
        // if storage location found, set component storage location to id
        // if not found, create new storage location and set component storage location to id
        component.storage_location = storageLocation
          ? storageLocation.id
          : (await postStorageCreate({ name: values[6], description: "", category: "" })).data.id;

        // do the same for category
        let categoryEnum = await getComponentCategoryEnum();
        let category = categoryEnum.data.find((category: ComponentCategory.ResGetComponentCategoryRecord) => {
          return category.name === values[0];
        });
        component.category = category
          ? category.id
          : (await postComponentCategoryCreate({ name: values[0], description: "", parent: "" })).data.id;

        await postComponentCreate(component);
      }
    }
  }
};

export const getComponent = async (id: string) => {
  let res = await client.collection("components").getOne(id);
  return { data: res } as unknown as APIdata<Component.ResGetComponentRecord>;
};

// ---- COMPONENT CATEGORIES ----

export const postComponentCategoryCreate = async (params: ComponentCategory.ReqCreateComponentCategoryParams) => {
  let record = await client.collection("component_categories").create(params);
  return { data: record } as unknown as APIdata<ComponentCategory.ResGetComponentCategoryRecord>;
};

export const patchComponentCategoryUpdate = async (params: ComponentCategory.ReqUpdateComponentCategoryParams) => {
  let record = await client.collection("component_categories").update(params.id, params);
  return { data: record } as unknown as APIdata<Component.ResGetComponentRecord>;
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
    console.log("getCompCatEnum res err", res, err);
    // return false;
  }
  res.items.forEach((component: ComponentCategory.ResGetComponentCategoryRecord) => {
    component._fullName = getPathName(res.items, component.id);
  });
  return { data: res.items } as unknown as APIdata<ComponentCategory.ResGetComponentCategoryRecord[]>;
};

export const getComponentCategoryEnumTree = async () => {
  let [res, err] = await tryCatchAsync(() => client.collection("component_categories").getList(1, 99999, { $autoCancel: false }));
  if (err) {
    console.log("getCompCatEnum res err", res, err);
    // return false;
  }
  const tree = arrayToTree(res.items, { id: "id", parentId: "parent", dataField: null });
  // console.log("tree", res.items, tree);
  return { data: tree } as unknown as APIdata<ComponentCategory.ResGetComponentCategoryRecordTree[]>;
};

// ---- FOOTPRINTS ----

export const getFootprintList = async (params: Footprint.ReqGetFootprintListParams) => {
  let res = await client.collection("footprints").getList(params.page, params.perPage, {
    filter: params.filter ? filterToPBString(params.filter) : "",
    sort: params.sort ?? "",
    expand: params.expand ?? ""
  });
  return { data: res } as unknown as APIdata<ResList<Footprint.ResGetFootprintRecord>>;
};

export const getFootprintsEnum = async () => {
  let res = await client.collection("footprints").getList(1, 99999, {});
  return { data: res.items } as unknown as APIdata<Footprint.ResGetFootprintRecord[]>;
};

export const postFootprintCreate = async (params: Footprint.ReqCreateFootprintParams) => {
  let record = await client.collection("footprints").create(params);
  return { data: record } as unknown as APIdata<Footprint.ResGetFootprintRecord>;
};

export const patchFootprintUpdate = async (params: Footprint.ReqUpdateFootprintParams) => {
  let record = await client.collection("footprints").update(params.id, params);
  return { data: record } as unknown as APIdata<Footprint.ResGetFootprintRecord>;
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
  return { data: record } as unknown as APIdata<FootprintCategory.ResGetFootprintCategoryRecord>;
};

export const patchFootprintCategoryUpdate = async (params: FootprintCategory.ReqUpdateFootprintCategoryParams) => {
  let record = await client.collection("footprint_categories").update(params.id, params);
  return { data: record } as unknown as APIdata<Footprint.ResGetFootprintRecord>;
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
    console.log("getFootprintCatEnum res err", res, err);
    return false;
  }
  res.items.forEach((footprint: FootprintCategory.ResGetFootprintCategoryRecord) => {
    footprint._fullName = getPathName(res.items, footprint.id);
  });
  return { data: res.items } as unknown as APIdata<FootprintCategory.ResGetFootprintCategoryRecord[]>;
};

export const getFootprintCategoryEnumTree = async () => {
  let [res, err] = await tryCatchAsync(() => client.collection("footprint_categories").getList(1, 99999, { $autoCancel: false }));
  if (err) {
    console.log("error", res, err);
    return false;
  }
  const tree = arrayToTree(res.items, { id: "id", parentId: "parent", dataField: null });
  return { data: tree } as unknown as APIdata<FootprintCategory.ResGetFootprintCategoryRecordTree[]>;
};

// ---- STORAGE LOCATIONS ----

export const getComponentStorageLocationEnum = async () => {
  let res = await client.collection("storage_locations").getList(1, 99999, { $autoCancel: false });
  console.log("storage_locations", res);
  return { data: res.items } as unknown as APIdata<Storage.ResGetStorageRecord[]>;
};

export const getStorageList = async (params: Storage.ReqGetStorageListParams) => {
  let res = await client.collection("storage_locations").getList(params.page, params.perPage, {
    filter: params.filter ? filterToPBString(params.filter) : "",
    sort: params.sort ?? "",
    expand: params.expand ?? ""
  });
  return { data: res } as unknown as APIdata<ResList<Storage.ResGetStorageRecord>>;
};

export const postStorageCreate = async (params: Storage.ReqCreateStorageParams) => {
  let record = await client.collection("storage_locations").create(params);
  return { data: record } as unknown as APIdata<Storage.ResGetStorageRecord>;
};

export const patchStorageUpdate = async (params: Storage.ReqUpdateStorageParams) => {
  let record = await client.collection("storage_locations").update(params.id, params);
  return { data: record } as unknown as APIdata<Storage.ResGetStorageRecord>;
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
  let storage_locations = (await getComponentStorageLocationEnum()) as APIdata<
    (Storage.ResGetStorageRecord & { parent: string; _fullName: string })[]
  >;
  let storage_categories = await getStorageCategoryEnum();
  // Since the storage locations are separate from storage categories, we need to merge them into a single array/tree
  // change category key of each storage_locations to parent
  storage_locations.data.forEach((storage_location: Storage.ResGetStorageRecord & { parent: string }) => {
    storage_location.parent = storage_location.category;
  });
  storage_categories.data.push(...storage_locations.data);
  storage_categories.data.forEach((storage_location: StorageCategory.ResGetStorageCategoryRecord) => {
    storage_location._fullName = getPathName(storage_categories.data, storage_location.id);
  });
  return { data: storage_categories.data } as unknown as APIdata<Storage.ResGetStorageRecord[]>;
};

export const getStorageLocationPathEnumTree = async () => {
  // The EnumTree is used primarily for tree-selects
  let storage_locations = (await getComponentStorageLocationEnum()) as APIdata<
    (Storage.ResGetStorageRecord & { parent: string; _fullName: string; disabled: boolean })[]
  >;
  let storage_categories = (await getStorageCategoryEnum()) as APIdata<
    (StorageCategory.ResGetStorageCategoryRecord & { disabled: boolean })[]
  >;
  // Since the storage locations are separate from storage categories, we need to merge them into a single array/tree
  // change category key of each storage_locations to parent
  storage_locations.data.forEach((storage_location: Storage.ResGetStorageRecord & { parent: string; disabled: boolean }) => {
    storage_location.parent = storage_location.category;
    storage_location.disabled = false;
  });
  storage_categories.data.forEach((storage_category: StorageCategory.ResGetStorageCategoryRecord & { disabled: boolean }) => {
    storage_category.disabled = true;
  });
  storage_categories.data.push(...storage_locations.data);
  storage_categories.data.forEach((storage_location: StorageCategory.ResGetStorageCategoryRecord) => {
    storage_location._fullName = getPathName(storage_categories.data, storage_location.id);
  });
  const tree = arrayToTree(storage_categories.data, { id: "id", parentId: "parent", dataField: null });
  console.log("getStorageLocationPathEnumTree", tree);
  return { data: tree } as unknown as APIdata<Storage.ResGetStorageRecordTree[]>;
};

// ---- STORAGE CATEGORY ----

export const postStorageCategoryCreate = async (params: StorageCategory.ReqCreateStorageCategoryParams) => {
  let record = await client.collection("storage_categories").create(params);
  return { data: record } as unknown as APIdata<StorageCategory.ResGetStorageCategoryRecord>;
};

export const patchStorageCategoryUpdate = async (params: StorageCategory.ReqUpdateStorageCategoryParams) => {
  let record = await client.collection("storage_categories").update(params.id, params);
  return { data: record } as unknown as APIdata<Storage.ResGetStorageRecord>;
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
    console.log("getStorageCatEnum res err", res, err);
    // return false;
  }
  res.items.forEach((storage_location: StorageCategory.ResGetStorageCategoryRecord) => {
    storage_location._fullName = getPathName(res.items, storage_location.id);
  });
  return { data: res.items } as unknown as APIdata<StorageCategory.ResGetStorageCategoryRecord[]>;
};

export const getStorageCategoryEnumTree = async () => {
  let [res, err] = await tryCatchAsync(() => client.collection("storage_categories").getList(1, 99999, { $autoCancel: false }));
  if (err) {
    console.log("error", res, err);
    return false;
  }
  const tree = arrayToTree(res.items, { id: "id", parentId: "parent", dataField: null });
  return { data: tree } as unknown as APIdata<StorageCategory.ResGetStorageCategoryRecordTree[]>;
};

// ---- PROJECTS ----

export const getProjectList = async (params: Project.ReqGetProjectListParams) => {
  let res = await client.collection("projects").getList(params.page, params.perPage, {
    filter: params.filter ? filterToPBString(params.filter) : "",
    sort: params.sort ?? "",
    expand: params.expand ?? ""
  });
  return { data: res } as unknown as APIdata<ResList<Project.ResGetProjectRecord>>;
};

export const getProjectsEnum = async () => {
  let res = await client.collection("projects").getList(1, 99999, {});
  return { data: res.items } as unknown as APIdata<Project.ResGetProjectRecord[]>;
};

export const postProjectCreate = async (params: Project.ReqCreateProjectParams) => {
  let record = await client.collection("projects").create(params);
  return { data: record } as unknown as APIdata<Project.ResGetProjectRecord>;
};

export const patchProjectUpdate = async (params: Project.ReqUpdateProjectParams) => {
  const record = await client.collection("projects").update(params.id, params);
  return { data: record } as unknown as APIdata<Project.ResGetProjectRecord>;
};

export const deleteProjects = async (params: Project.ReqDeleteProjectsParams) => {
  // TODO: speed this up??
  for (const id of params.ids) {
    await client.collection("projects").delete(id);
  }
  return true;
};

// ---- PROJECT COMPONENTS ----

export const getProjectComponentsList = async (
  params: ProjectComponents.ReqGetProjectComponentListParams & { filter?: { _mpn?: string; _description?: string } }
) => {
  if (params.projectID === "")
    return { data: emptyData(params) } as unknown as APIdata<ResList<ProjectComponents.ResGetProjectComponentRecord>>;
  let res_project = (await client.collection("projects").getOne(params.projectID, {})) as unknown as Project.ResGetProjectRecord;

  if (res_project.components.length === 0) res_project.components = ["none"];

  let filter: object = {};
  nestedObjectAssign(filter, res_project.components ? { id: res_project.components } : {});
  nestedObjectAssign(filter, params.filter?._mpn ? { "component.mpn": params.filter?._mpn } : {});
  nestedObjectAssign(filter, params.filter?._description ? { "component.description": params.filter?._description } : {});
  let res_project_components = (await client.collection("project_components").getList(1, 99999, {
    filter: filterToPBString(filter),
    sort: params.sort ?? "",
    expand: "component" // params.expand ?? ""
  })) as unknown as ResList<ProjectComponents.ResGetProjectComponentRecord>;

  // anchor expand.component.mpn and description into each res_project_components.items
  res_project_components.items.forEach(function (cInProj, index, theArray) {
    theArray[index]._id = cInProj.expand.component.id;
    theArray[index]._mpn = cInProj.expand.component.mpn;
    theArray[index]._description = cInProj.expand.component.description;
  });

  let res = res_project_components;

  return { data: res } as unknown as APIdata<ResList<ProjectComponents.ResGetProjectComponentRecord>>;
};

export const getProjectComponentsListForExport = async (params: ProjectComponents.ReqGetProjectComponentListForExportParams) => {
  if (params.projectID === "")
    return { data: emptyData() } as unknown as APIdata<ResList<ProjectComponents.ResGetProjectComponentRecord>>;
  let res = await getProjectComponentsList({
    page: 1,
    perPage: 9999,
    filter: params.filter,
    expand: "",
    sort: "",
    projectID: params.projectID
  });
  return res.data.items as unknown as ProjectComponents.ResGetProjectComponentRecord[];
};

export const postProjectComponentAdd = async (params: ProjectComponents.ReqAddProjectComponentParams) => {
  let res_project_components = await client
    .collection("project_components")
    .create({ component: params._id, quantity: params.quantity });

  let res_project = (await client
    .collection("projects")
    .getOne(params._ofProjectID, {})) as unknown as Project.ResGetProjectRecord;

  // append res_project_components.id to res_project.components
  res_project.components.push(res_project_components.id);

  const record = (await client
    .collection("projects")
    .update(params._ofProjectID, res_project)) as unknown as Project.ResGetProjectRecord;
  return { data: record } as unknown as APIdata<ProjectComponents.ResGetProjectComponentRecord>;
};

export const postProjectComponentUpdate = async (params: ProjectComponents.ReqUpdateProjectComponentParams) => {
  const record = await client
    .collection("project_components")
    .update(params.id, { component: params._id, quantity: params.quantity });
  return { data: record } as unknown as APIdata<ProjectComponents.ResGetProjectComponentRecord>;
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
  return { data: record } as unknown as APIdata<Project.ResGetProjectRecord>;
};

// ---- COMPONENT LOGS ----

export const getComponentLogsList = async (params: ComponentLog.ReqGetComponentLogListParams) => {
  let res = (await client.collection("component_log").getList(params.page, params.perPage, {
    filter: params.filter ? filterToPBString(params.filter) : "",
    sort: params.sort ?? "",
    expand: params.expand ?? ""
  })) as unknown as ResList<ComponentLog.ResGetComponentLogRecord>;
  return { data: res } as unknown as APIdata<ResList<ComponentLog.ResGetComponentLogRecord>>;
};

// ---- USERS ----

export const getUserList = async (params: User.ReqGetUserListParams) => {
  let res = await client.collection("profiles").getList(params.page, params.perPage, {
    filter: params.filter ? filterToPBString(params.filter) : "",
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
  await client.collection("profiles").delete(params.id);
};

export const postUserCreate = async (params: User.ReqCreateUserParams) => {
  let record = await client.collection("profiles").create(params);
  return { data: record } as unknown as APIdata<User.ResGetUserRecord>;
};

export const patchUserUpdate = async (params: User.ReqUpdateUserParams) => {
  const record = await client.collection("profiles").update(params.id, params);
  return { data: record } as unknown as APIdata<User.ResGetUserRecord>;
};

export const deleteUsers = async (params: User.ReqDeleteUsersParams) => {
  // TODO: speed this up??
  for (const id of params.ids) {
    await client.collection("profiles").delete(id);
  }
  return true;
};

export const getUserEnum = async () => {
  let [res, err] = await tryCatchAsync(() => client.collection("profiles").getList(1, 99999, { $autoCancel: false }));
  if (err) {
    console.log("getUserEnum res err", res, err);
    // return false;
  }
  return { data: res.items } as unknown as APIdata<User.ResGetUserRecord[]>;
};

// ---- SETTINGS/CONFIG ----

export const getConfig = async (params: Config.ReqGetConfigParams) => {
  let res = (await client.collection("config").getList()) as unknown as ResList<Config.ResGetConfigRecord>;
  let configRecord = res.items.find(record => record.category === params.category);
  return { data: configRecord?.value } as unknown as APIdata<ResList<Config.ResGetConfigRecord>>;
};

export const patchConfigUpdate = async (params: Config.ReqUpdateConfigParams) => {
  let res = (await client.collection("config").getList()) as unknown as ResList<Config.ResGetConfigRecord>;
  let configRecord = res.items.find(record => record.category === params.category);
  if (!configRecord) return;
  const record = await client.collection("config").update("", configRecord?.id, params);
  return { data: record } as unknown as APIdata<Config.ResGetConfigRecord>;
};

// ---- DASHBOARD ----

export const getDashboardInfo = async () => {
  type DashboardInfo = {
    uniqueComponents: number;
    totalComponents: number;
    totalProjects: number;
    totalStorageLocations: number;
    components: Component.ResGetComponentRecord[];
    storageLocations: Storage.ResGetStorageRecord[];
    storageLocationsTree: Storage.ResGetStorageRecordTree[];
  };

  let res = (await client.send("/api/custom/dashboard/info", {})) as unknown as APIdata<DashboardInfo>;
  let storageLocationsTree = await getStorageLocationPathEnumTree();

  let components = res.data.components;

  // iterate recursively and find each elements where child = [] and set value: 1
  async function iter(o: any) {
    if (o.children && o.children.length !== 0) {
      o.children.forEach((c: any) => iter(c));
    } else {
      // set value to component qty
      o.value = components.filter((component: Component.ResGetComponentRecord) => component.storage_location === o.id).length;
    }
  }
  for (const storageLocation of storageLocationsTree.data) {
    await iter(storageLocation);
  }
  res.data.storageLocationsTree = storageLocationsTree.data;
  return { data: res.data } as unknown as APIdata<DashboardInfo>;
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
//   return { data: data } as unknown as APIdata<{ name: string; quantity: number }[]>;
// }
