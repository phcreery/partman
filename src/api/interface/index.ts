// * Paging request parameters
export interface ReqList {
  page: number;
  perPage: number;
  sort?: string;
  filter?: object; // string;
  expand?: string;
}

// * Paging response parameter
export interface ResList<T> {
  items: T[];
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}

// * Request response parameter (excluding data)
// export interface Result {
// 	code: string;
// 	msg: string;
// }

// * Request response parameter (containing data)
// export interface ResultData<T = any> extends Result {
// 	data?: T;
// }

export type APIdata<T> = { data: T };

// * Login module
export namespace Login {
  export interface ReqLoginParams {
    username: string;
    password: string;
  }
  export interface ResLogin {
    token: string;
    record: object;
  }
  export interface ResAuthButtons {
    [propName: string]: any;
  }
}

export interface ReqRecord {
  id: string;
}

export interface ResGetRecord {
  id: string;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
  expand: object;
}

type spec = {
  attribute: {
    name: string;
    shortname: string;
    group: string;
  };
  value: string;
  units: string;
};

export namespace Component {
  export type ComponentColumns = {
    mpn: string;
    manufacturer: string;
    description: string;
    stock: number;
    comment: string;
    storage_location: string;
    category: string;
    footprint: string;
    supplier: string;
    spn: string;
    ipn: string;
    specs: spec[];
  };
  // Requests
  export type ReqGetComponentListParams = ReqList;
  export type ReqGetComponentListForExportParams = { filter: ReqList["filter"] };
  export type ReqCreateComponentParams = ComponentColumns;
  export interface ReqUpdateComponentParams extends ReqRecord, ComponentColumns {}
  export type ReqDeleteComponentParams = ReqRecord;
  export type ReqDeleteComponentsParams = { ids: string[] };
  // Responses
  export interface ResGetComponentRecord extends ResGetRecord, ComponentColumns {}
}

export namespace ComponentCategory {
  type ComponentCategoryColumns = {
    name: string;
    parent: string;
    description: string;
  };
  // Requests
  export type ReqGetCategoryListParams = ReqList;
  export type ReqCreateComponentCategoryParams = ComponentCategoryColumns;
  export interface ReqUpdateComponentCategoryParams extends ReqRecord, ComponentCategoryColumns {}
  export type ReqDeleteComponentCategoriesParams = { ids: string[] };
  // Responses
  export interface ResGetComponentCategoryRecord extends ResGetRecord, ComponentCategoryColumns {
    _fullName: string;
  }
  export interface ResGetComponentCategoryRecordTree extends ResGetComponentCategoryRecord {
    children: ResGetComponentCategoryRecordTree;
  }
}

export namespace Footprint {
  type FootprintColumns = {
    name: string;
    description: number;
    category: string;
  };
  // Requests
  export type ReqGetFootprintListParams = ReqList;
  export type ReqCreateFootprintParams = FootprintColumns;
  export interface ReqUpdateFootprintParams extends ReqRecord, FootprintColumns {}
  export type ReqDeleteFootprintsParams = { ids: string[] };
  // Responses
  export interface ResGetFootprintRecord extends ResGetRecord, FootprintColumns {}
}

export namespace FootprintCategory {
  type FootprintCategoryColumns = {
    name: string;
    description: number;
    parent: string;
  };
  // Requests
  export type ReqGetFootprintCategoryListParams = ReqList;
  export type ReqCreateFootprintCategoryParams = FootprintCategoryColumns;
  export interface ReqUpdateFootprintCategoryParams extends ReqRecord, FootprintCategoryColumns {}
  export type ReqDeleteFootprintCategoriesParams = { ids: string[] };
  // Responses
  export interface ResGetFootprintCategoryRecord extends ResGetRecord, FootprintCategoryColumns {
    _fullName: string;
  }
  export interface ResGetFootprintCategoryRecordTree extends ResGetFootprintCategoryRecord {
    children: ResGetFootprintCategoryRecordTree;
  }
}

export namespace Storage {
  type StorageColumns = {
    name: string;
    description: string;
    category: string;
  };
  // Requests
  export type ReqGetStorageListParams = ReqList;
  export type ReqCreateStorageParams = StorageColumns;
  export interface ReqUpdateStorageParams extends ReqRecord, StorageColumns {}
  export type ReqDeleteStoragesParams = { ids: string[] };
  // Responses
  export interface ResGetStorageRecord extends ResGetRecord, StorageColumns {
    _fullName: string;
  }
  export interface ResGetStorageRecordTree extends ResGetStorageRecord {
    children: ResGetStorageRecordTree;
  }
}

export namespace StorageCategory {
  type StorageCategoryColumns = {
    name: string;
    description: string;
    parent: string;
  };
  // Requests
  export type ReqGetStorageCategoryListParams = ReqList;
  export type ReqCreateStorageCategoryParams = StorageCategoryColumns;
  export interface ReqUpdateStorageCategoryParams extends ReqRecord, StorageCategoryColumns {}
  export type ReqDeleteStorageCategoriesParams = { ids: string[] };
  // Responses
  export interface ResGetStorageCategoryRecord extends ResGetRecord, StorageCategoryColumns {
    _fullName: string;
  }
  export interface ResGetStorageCategoryRecordTree extends ResGetStorageCategoryRecord {
    children: ResGetStorageCategoryRecordTree;
  }
}

export namespace OctopartConfig {
  type OctopartConfigColumns = {
    octopart_id: string;
    octopart_secret: string;
  };
  // Requests
  export type ReqGetOctopartConfigListParams = ReqList;
  export type ReqCreateOctopartConfigParams = OctopartConfigColumns;
  export interface ReqUpdateOctopartConfigParams extends ReqRecord, OctopartConfigColumns {}
  export type ReqDeleteOctopartConfigParams = { ids: string[] };
  // Responses
  export interface ResGetOctopartConfigRecord extends ResGetRecord, OctopartConfigColumns {
    _fullName: string;
  }
  export interface ResGetOctopartConfigRecordTree extends ResGetOctopartConfigRecord {
    children: ResGetOctopartConfigRecordTree;
  }
}

export namespace Project {
  type ProjectColumns = {
    name: string;
    description: number;
    components: string[];
  };
  // Requests
  export type ReqGetProjectListParams = ReqList;
  export type ReqCreateProjectParams = ProjectColumns;
  export interface ReqUpdateProjectParams extends ReqRecord, ProjectColumns {}
  export type ReqDeleteProjectsParams = { ids: string[] };
  // Responses
  export interface ResGetProjectRecord extends ResGetRecord, ProjectColumns {}
}

export namespace ProjectComponents {
  type ProjectComponentColumns = {
    component: string;
    quantity: number;
    refdesignators: string;
    _id: string;
    _mpn: string;
    _description: string;
  };
  // Project Components
  // Requests
  export interface ReqGetProjectComponentListParams extends ReqList {
    projectID: string;
  }
  export type ReqGetProjectComponentListForExportParams = { filter: ReqList["filter"]; projectID: string };
  export interface ReqAddProjectComponentParams extends ProjectComponentColumns {
    _ofProjectID: string;
  }
  export interface ReqUpdateProjectComponentParams extends ReqRecord, ProjectComponentColumns {
    _ofProjectID: string;
  }
  export type ReqRemoveProjectComponentsParams = { projectID: string; ids: string[] };
  // Responses
  export interface ResGetProjectComponentRecord extends ResGetRecord, ProjectComponentColumns {
    expand: { component: Component.ComponentColumns & ResGetRecord };
  }
}

export namespace ComponentLog {
  type ComponentLogColumns = {
    component: string;
    description: string;
    new_value: string;
    old_value: string;
  };
  // Requests
  export type ReqGetComponentLogListParams = ReqList;
  export type ReqCreateComponentLogParams = ComponentLogColumns;
  export interface ReqUpdateComponentLogParams extends ReqRecord, ComponentLogColumns {}
  export type ReqDeleteStorageCategoriesParams = { ids: string[] };
  // Responses
  export interface ResGetComponentLogRecord extends ResGetRecord, ComponentLogColumns {
    _fullName: string;
  }
  export interface ResGetComponentLogRecordTree extends ResGetComponentLogRecord {
    children: ResGetComponentLogRecordTree;
  }
}

export namespace User {
  export type UserColumns = {
    name: string;
    avatar: string;
    userId: string;
  };
  // Requests
  export type ReqGetUserListParams = ReqList;
  export type ReqGetUserListForExportParams = { filter: ReqList["filter"] };
  export type ReqCreateUserParams = UserColumns;
  export interface ReqUpdateUserParams extends ReqRecord, UserColumns {}
  export type ReqDeleteUserParams = ReqRecord;
  export type ReqDeleteUsersParams = { ids: string[] };
  // Responses
  export interface ResGetUserRecord extends ResGetRecord, UserColumns {}
}

export namespace Config {
  export type ConfigColumns = {
    category: string;
    value: any;
  };
  // Requests
  export type ReqGetConfigParams = { category: string };
  export type ReqUpdateConfigParams = ConfigColumns;
  // Responses
  export interface ResGetConfigRecord extends ResGetRecord, ConfigColumns {}
}
