import { arrayToTree } from "performant-array-to-tree"; // Note: deprecated
import type { ListResult } from "pocketbase";

import { nestedObjectAssign } from "@/utils/nestedObjectAssign";
import client, { tryCatchAsync } from "@/api";
import { Collections } from "@/api/interface/pocketbase-types";
import { emptyData, filterToPBString, getPathName } from "@/api/helper/pocketbase";

import {
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
  Backup
} from "@/api/interface/index";

export const getFileUrl = (record: any, name: string, queryParams?: {} | undefined) => {
  return client.files.getURL(record, name, queryParams);
};

// ---- COMPONENTS ----

export const getComponentList = async (params: Component.ReqGetComponentListParams) => {
  let res = await client.collection(Collections.Components).getList(params.page, params.perPage, {
    // filter: Object.keys(params.filter).length !== 0 ? params.filter : "",
    filter: params.filter ? filterToPBString(params.filter) : "",
    sort: params.sort ?? "",
    expand: params.expand ?? "", // Default expand all???
    $autoCancel: false
  });
  return res as unknown as ListResult<Component.ResGetComponentRecord>;
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
  await client.collection(Collections.Components).delete(params.id);
};

export const postComponentCreate = async (params: Component.ReqCreateComponentParams) => {
  let record = await client.collection(Collections.Components).create(params);
  return { data: record } as unknown as Component.ResGetComponentRecord;
};

export const patchComponentUpdate = async (params: Component.ReqUpdateComponentParams, id?: string) => {
  let record = await client.collection(Collections.Components).update(id ?? params.id, params);
  return { data: record } as unknown as Component.ResGetComponentRecord;
};

// TODO: convert this to a backend function
export const deleteComponents = async (params: Component.ReqDeleteComponentsParams) => {
  // TODO: speed this up??
  for (const id of params.ids) {
    await client.collection(Collections.Components).delete(id);
  }
  return true;
};

export const getComponentEnum = async () => {
  // TODO: use pb.collection('example').getFullList();
  let [res, err] = await tryCatchAsync(() => client.collection(Collections.Components).getList(1, 99999, { $autoCancel: false }));
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
  let res = await client.collection(Collections.Components).getOne(id);
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
  let record = await client.collection(Collections.ComponentCategories).create(params);
  return record as unknown as ComponentCategory.ResGetComponentCategoryRecord;
};

export const patchComponentCategoryUpdate = async (params: ComponentCategory.ReqUpdateComponentCategoryParams) => {
  let record = await client.collection(Collections.ComponentCategories).update(params.id, params);
  return record as unknown as Component.ResGetComponentRecord;
};

export const deleteComponentCategories = async (params: ComponentCategory.ReqDeleteComponentCategoriesParams) => {
  // TODO: speed this up??
  for (const id of params.ids) {
    await client.collection(Collections.ComponentCategories).delete(id);
  }
  return true;
};

export const getComponentCategoryEnum = async () => {
  let [res, err] = await tryCatchAsync(() =>
    client.collection(Collections.ComponentCategories).getList(1, 99999, { $autoCancel: false })
  );
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
  let res = await client.collection(Collections.Footprints).getList(params.page, params.perPage, {
    filter: params.filter ? filterToPBString(params.filter) : "",
    sort: params.sort ?? "",
    expand: params.expand ?? ""
  });
  return res as unknown as ListResult<Footprint.ResGetFootprintRecord>;
};

export const getFootprintsEnum = async () => {
  let res = await client.collection(Collections.Footprints).getList(1, 99999, {});
  return res.items as unknown as Footprint.ResGetFootprintRecord[];
};

export const postFootprintCreate = async (params: Footprint.ReqCreateFootprintParams) => {
  let record = await client.collection(Collections.Footprints).create(params);
  return record as unknown as Footprint.ResGetFootprintRecord;
};

export const patchFootprintUpdate = async (params: Footprint.ReqUpdateFootprintParams) => {
  let record = await client.collection(Collections.Footprints).update(params.id, params);
  return record as unknown as Footprint.ResGetFootprintRecord;
};

export const deleteFootprints = async (params: Footprint.ReqDeleteFootprintsParams) => {
  // TODO: speed this up??
  for (const id of params.ids) {
    await client.collection(Collections.Footprints).delete(id);
  }
  return true;
};

// ---- FOOTPRINT CATEGORY ----

export const postFootprintCategoryCreate = async (params: FootprintCategory.ReqCreateFootprintCategoryParams) => {
  let record = await client.collection(Collections.FootprintCategories).create(params);
  return record as unknown as FootprintCategory.ResGetFootprintCategoryRecord;
};

export const patchFootprintCategoryUpdate = async (params: FootprintCategory.ReqUpdateFootprintCategoryParams) => {
  let record = await client.collection(Collections.FootprintCategories).update(params.id, params);
  return record as unknown as Footprint.ResGetFootprintRecord;
};

export const deleteFootprintCategories = async (params: FootprintCategory.ReqDeleteFootprintCategoriesParams) => {
  // TODO: speed this up??
  for (const id of params.ids) {
    await client.collection(Collections.FootprintCategories).delete(id);
  }
  return true;
};

export const getFootprintCategoryEnum = async () => {
  let [res, err] = await tryCatchAsync(() =>
    client.collection(Collections.FootprintCategories).getList(1, 99999, { $autoCancel: false })
  );
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
  let res = await client.collection(Collections.StorageLocations).getList(1, 99999, { $autoCancel: false });
  return res.items as unknown as Storage.ResGetStorageRecord[];
};

export const getStorageList = async (params: Storage.ReqGetStorageListParams) => {
  let res = await client.collection(Collections.StorageLocations).getList(params.page, params.perPage, {
    filter: params.filter ? filterToPBString(params.filter) : "",
    sort: params.sort ?? "",
    expand: params.expand ?? ""
  });
  return res as unknown as ListResult<Storage.ResGetStorageRecord>;
};

export const postStorageCreate = async (params: Storage.ReqCreateStorageParams) => {
  let record = await client.collection(Collections.StorageLocations).create(params);
  return record as unknown as Storage.ResGetStorageRecord;
};

export const patchStorageUpdate = async (params: Storage.ReqUpdateStorageParams) => {
  let record = await client.collection(Collections.StorageLocations).update(params.id, params);
  return record as unknown as Storage.ResGetStorageRecord;
};

export const deleteStorages = async (params: Storage.ReqDeleteStoragesParams) => {
  // TODO: speed this up??
  for (const id of params.ids) {
    await client.collection(Collections.StorageLocations).delete(id);
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
  let record = await client.collection(Collections.StorageCategories).create(params);
  return record as unknown as StorageCategory.ResGetStorageCategoryRecord;
};

export const patchStorageCategoryUpdate = async (params: StorageCategory.ReqUpdateStorageCategoryParams) => {
  let record = await client.collection(Collections.StorageCategories).update(params.id, params);
  return record as unknown as Storage.ResGetStorageRecord;
};

export const deleteStorageCategories = async (params: StorageCategory.ReqDeleteStorageCategoriesParams) => {
  // TODO: speed this up??
  for (const id of params.ids) {
    await client.collection(Collections.StorageCategories).delete(id);
  }
  return true;
};

export const getStorageCategoryEnum = async () => {
  let [res, err] = await tryCatchAsync(() =>
    client.collection(Collections.StorageCategories).getList(1, 99999, { $autoCancel: false })
  );
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
  let res = await client.collection(Collections.Projects).getList(params.page, params.perPage, {
    filter: params.filter ? filterToPBString(params.filter) : "",
    sort: params.sort ?? "",
    expand: params.expand ?? ""
  });
  return res as unknown as ListResult<Project.ResGetProjectRecord>;
};

export const getProjectListForEnum = async () => {
  let res = await client.collection(Collections.Projects).getList(1, 99999, {});
  return res.items as unknown as Project.ResGetProjectRecord[];
};

export const getProjectsEnum = async () => {
  let res = await client.collection(Collections.Projects).getList(1, 99999, {});
  return res.items as unknown as Project.ResGetProjectRecord[];
};

export const postProjectCreate = async (params: Project.ReqCreateProjectParams) => {
  let record = await client.collection(Collections.Projects).create(params);
  return record as unknown as Project.ResGetProjectRecord;
};

export const patchProjectUpdate = async (params: Project.ReqUpdateProjectParams) => {
  const record = await client.collection(Collections.Projects).update(params.id, params);
  return record as unknown as Project.ResGetProjectRecord;
};

export const deleteProjects = async (params: Project.ReqDeleteProjectsParams) => {
  // TODO: speed this up??
  for (const id of params.ids) {
    await client.collection(Collections.Projects).delete(id);
  }
  return true;
};

// ---- PROJECT COMPONENTS ----

export const getProjectComponentsList = async (params: ProjectComponents.ReqGetProjectComponentListParams) => {
  if (params.projectID === "") return emptyData(params) as unknown as ListResult<ProjectComponents.ResGetProjectComponentRecord>;
  let res_project = (await client
    .collection(Collections.Projects)
    .getOne(params.projectID, {})) as unknown as Project.ResGetProjectRecord;

  if (res_project.components.length === 0) res_project.components = [];

  let filter: object = {};
  nestedObjectAssign(filter, res_project.components ? { id: res_project.components } : {});
  nestedObjectAssign(filter, params.filter?.bom_id ? { bom_id: params.filter?.bom_id } : {});
  nestedObjectAssign(filter, params.filter?.component ? { component: params.filter?.component } : {});
  nestedObjectAssign(filter, params.filter?.refdesignators ? { refdesignators: params.filter?.refdesignators } : {});

  // Expand component fields
  nestedObjectAssign(
    filter,
    params.filter?.["expand.component.manufacturer"]
      ? { "component.manufacturer": params.filter?.["expand.component.manufacturer"] }
      : {}
  );
  nestedObjectAssign(
    filter,
    params.filter?.["expand.component.mpn"] ? { "component.mpn": params.filter?.["expand.component.mpn"] } : {}
  );
  nestedObjectAssign(
    filter,
    params.filter?.["expand.component.supplier"] ? { "component.supplier": params.filter?.["expand.component.supplier"] } : {}
  );
  nestedObjectAssign(
    filter,
    params.filter?.["expand.component.spn"] ? { "component.spn": params.filter?.["expand.component.spn"] } : {}
  );
  nestedObjectAssign(
    filter,
    params.filter?.["expand.component.category"] ? { "component.category": params.filter?.["expand.component.category"] } : {}
  );
  nestedObjectAssign(
    filter,
    params.filter?.["expand.component.footprint"] ? { "component.footprint": params.filter?.["expand.component.footprint"] } : {}
  );
  nestedObjectAssign(
    filter,
    params.filter?.["expand.component.description"]
      ? { "component.description": params.filter?.["expand.component.description"] }
      : {}
  );

  let res_project_components = (await client.collection(Collections.ProjectComponents).getList(params.page, params.perPage, {
    filter: filterToPBString(filter),
    sort: params.sort ?? "",
    expand: "component" // params.expand ?? "",
  })) as unknown as ListResult<ProjectComponents.ResGetProjectComponentRecord>;

  let res = res_project_components;

  return res as unknown as ListResult<ProjectComponents.ResGetProjectComponentRecord>;
};

export const getProjectComponentsListForExport = async (params: ProjectComponents.ReqGetProjectComponentListForExportParams) => {
  if (params.projectID === "") return emptyData() as unknown as ListResult<ProjectComponents.ResGetProjectComponentRecord>;
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
  let res_project_components = await client.collection(Collections.ProjectComponents).create({
    bom_id: params.bom_id,
    component: params.component,
    quantity: params.quantity,
    refdesignators: params.refdesignators
  });

  let res_project = (await client
    .collection(Collections.Projects)
    .getOne(params._ofProjectID, {})) as unknown as Project.ResGetProjectRecord;

  // append res_project_components.id to res_project.components
  res_project.components.push(res_project_components.id);

  const record = (await client
    .collection(Collections.Projects)
    .update(params._ofProjectID, res_project)) as unknown as Project.ResGetProjectRecord;
  return record as unknown as ProjectComponents.ResGetProjectComponentRecord;
};

export const patchProjectComponentUpdate = async (params: ProjectComponents.ReqUpdateProjectComponentParams) => {
  const record = await client.collection(Collections.ProjectComponents).update(params.id, {
    bom_id: params.bom_id,
    component: params.component,
    quantity: params.quantity,
    refdesignators: params.refdesignators
  });
  return record as unknown as ProjectComponents.ResGetProjectComponentRecord;
};

export const deleteProjectComponents = async (params: ProjectComponents.ReqRemoveProjectComponentsParams) => {
  let res_project = (await client
    .collection(Collections.Projects)
    .getOne(params.projectID, {})) as unknown as Project.ResGetProjectRecord;
  for (const id of params.ids) {
    let index = res_project.components.findIndex(x => x == id);
    if (index !== -1) {
      res_project.components.splice(index, 1);
    }
    await client.collection(Collections.ProjectComponents).delete(id);
  }
  const record = await client.collection(Collections.Projects).update(params.projectID, res_project);
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
  let res = (await client.collection(Collections.ProjectBuilds).getList(params.page, params.perPage, {
    filter: params.filter ? filterToPBString(params.filter) : "",
    sort: params.sort ?? "",
    expand: params.expand ?? ""
  })) as unknown as ListResult<ProjectBuilds.ResGetProjectBuildRecord>;
  return res as unknown as ListResult<ProjectBuilds.ResGetProjectBuildRecord>;
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
  let res = await client.collection(Collections.ProjectBuilds).create(params);
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
  let res = (await client.collection(Collections.ComponentLog).getList(params.page, params.perPage, {
    filter: params.filter ? filterToPBString(params.filter) : "",
    sort: params.sort ?? "",
    expand: params.expand ?? ""
  })) as unknown as ListResult<ComponentLog.ResGetComponentLogRecord>;
  return res as unknown as ListResult<ComponentLog.ResGetComponentLogRecord>;
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
  let res = await client.collection(Collections.Users).getList(params.page, params.perPage, {
    filter: params.filter ? filterToPBString(params.filter) : "",
    sort: params.sort ?? "",
    expand: params.expand ?? "" // Default expand all???
  });
  return res as unknown as ListResult<User.ResGetUserRecord>;
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
  let res = await client.collection(Collections.Users).getOne(params.id);
  return res as unknown as User.ResGetUserRecord;
};

export const deleteUser = async (params: User.ReqDeleteUserParams) => {
  await client.collection(Collections.Users).delete(params.id);
};

export const postUserCreate = async (params: User.ReqCreateUserParams) => {
  params.passwordConfirm = params.password; // PocketBase requires passwordConfirm to be the same as password
  let record = await client.collection(Collections.Users).create(params);
  return record as unknown as User.ResGetUserRecord;
};

export const patchUserUpdate = async (params: User.ReqUpdateUserParams) => {
  const record = await client.collection(Collections.Users).update(params.id, params);
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
  let [res, err] = await tryCatchAsync(() => client.collection(Collections.Users).getList(1, 99999, { $autoCancel: false }));
  if (err) {
    console.error("getUserEnum res err", res, err);
    // return false;
  }
  return res.items as unknown as User.ResGetUserRecord[];
};

// ---- SETTINGS/CONFIG ----

export const getConfig = async (params: Config.ReqGetConfigParams) => {
  let res = (await client.collection(Collections.Config).getList()) as unknown as ListResult<Config.ResGetConfigRecord>;
  let configRecord = res.items.find(record => record.category === params.category);
  return configRecord?.value as unknown as ListResult<Config.ResGetConfigRecord>;
};

export const patchConfigUpdate = async (params: Config.ReqUpdateConfigParams) => {
  let res = (await client.collection(Collections.Config).getList()) as unknown as ListResult<Config.ResGetConfigRecord>;
  let configRecord = res.items.find(record => record.category === params.category);
  // create if not found
  if (!configRecord) {
    res = await client.collection(Collections.Config).create({ category: params.category, value: params.value });
  }
  if (!configRecord?.id) {
    console.error("patchConfigUpdate configRecord?.id not found", configRecord);
    return false;
  }
  const record = await client.collection(Collections.Config).update(configRecord?.id, params);
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

  let res = await client.send<DashboardInfo>("/api/custom/dashboard/info", {});

  let storageLocationsTree = await getStorageLocationPathEnumTree();
  let components = res.components;

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
  res.storageLocationsTree = storageLocationsTree;
  return res as unknown as DashboardInfo;
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

export const getBackupsList = async (): Promise<ListResult<Backup.ResGetBackupRecord>> => {
  const backups = await client.backups.getFullList();
  // return backups as unknown as Backup.ResGetBackupRecord[];
  return {
    items: backups as unknown as Backup.ResGetBackupRecord[],
    page: 1,
    perPage: backups.length,
    totalItems: backups.length,
    totalPages: 1
  };
};

export const postBackupCreate = async (params?: Backup.ReqCreateBackupParams) => {
  const name = params?.name ? params.name : "";
  const backup = await client.backups.create(name);
  return backup as unknown as Backup.ResGetBackupRecord;
};

export const deleteBackup = async (params: Backup.ReqDeleteBackupParams) => {
  await client.backups.delete(params.key);
};

export const deleteBackups = async (params: Backup.ReqDeleteBackupsParams) => {
  for (const key of params.keys) {
    await client.backups.delete(key);
  }
  return true;
};

export const postBackupRestore = async (params: Backup.ReqRestoreBackupParams) => {
  await client.backups.restore(params.key);
};

export const getBackupDownloadURL = async (params: Backup.ReqDownloadBackupParams) => {
  const token = await client.files.getToken();
  const backupURL = await client.backups.getDownloadURL(token, params.key);
  return backupURL;
};

export const postBackupUpload = async (params: Backup.ReqUploadBackupParams) => {
  const res = await client.backups.upload(params);
  return res;
};

// ---- HEALTH ----

export const getHealth = async () => {
  return client.health.check();
};
