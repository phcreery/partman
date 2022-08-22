// * Paging request parameters
export interface ReqList {
	page: number;
	perPage: number;
	sort: String;
	filter: String;
	expand: String;
}

// * Paging response parameter
export interface ResList<T> {
	// datalist: T[];
	// pageNum: number;
	// pageSize: number;
	// total: number;
	items: T[];
	page: number;
	perPage: number;
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

// * Login module
export namespace Login {
	export interface ReqLoginParams {
		username: string;
		password: string;
	}
	export interface ResLogin {
		token: string;
		user: object;
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
	"@collectionId": string;
	"@collectionName": string;
	"@expand": object;
}

export namespace Component {
	type ComponentColumns = {
		name: string;
		description: number;
		stock: number;
		comment: string;
		storage_location: string;
		category: string;
		footprint: string;
		ipn: string;
	};
	// Requests
	export type ReqGetComponentListParams = ReqList;
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
		description: number;
	};
	// Requests
	export type ReqGetCategoryListParams = ReqList;
	// Responses
	export interface ResGetCategoryRecord extends ResGetRecord, ComponentCategoryColumns {
		_fullName: string;
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
	export interface ResGetFootprintCategoryRecord extends ResGetRecord, FootprintCategoryColumns {}
}

export namespace Storage {
	type StorageColumns = {
		name: string;
		description: number;
	};
	// Requests
	export type ReqGetStorageListParams = ReqList;
	// Responses
	export interface ResGetStorageRecord extends ResGetRecord, StorageColumns {}
}
