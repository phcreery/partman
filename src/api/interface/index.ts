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
export interface Result {
	code: string;
	msg: string;
}

// * Request response parameter (containing data)
export interface ResultData<T = any> extends Result {
	data?: T;
}

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

// // * User management module
// export namespace User {
// 	export interface ReqGetUserParams extends ReqList {
// 		username: string;
// 		gender: number;
// 		idCard: string;
// 		email: string;
// 		address: string;
// 		createTime: string[];
// 		status: number;
// 	}
// 	export interface ResUserList {
// 		id: string;
// 		username: string;
// 		gender: string;
// 		age: number;
// 		idCard: string;
// 		email: string;
// 		address: string;
// 		createTime: string;
// 		status: number;
// 		avatar: string;
// 		children?: ResUserList[];
// 	}
// 	export interface ResStatus {
// 		userLabel: string;
// 		userValue: number;
// 	}
// 	export interface ResGender {
// 		genderLabel: string;
// 		genderValue: number;
// 	}
// }

// * File upload module
// export namespace Upload {
// 	export interface ResFileUrl {
// 		fileUrl: string;
// 	}
// }

export interface ResGetRecord {
	"@collectionId": string;
	"@collectionName": string;
	"@expand": object;
}

export namespace Component {
	export type ReqGetComponentListParams = ReqList;
	export interface ReqCreateComponentParams {
		id: string;
		name: string;
		description: number;
		stock: number;
		comment: string;
		storage_location: string;
		category: string;
		footprint: string;
		ipn: string;
	}
	export type ReqUpdateComponentParams = ReqCreateComponentParams;
	export type ReqDeleteComponentParams = { id: string };
	export type ReqDeleteComponentsParams = { ids: string[] };
	export interface ResGetComponentRecord extends ResGetRecord {
		id: string;
		created: string;
		updated: string;
		name: string;
		description: number;
		stock: number;
		comment: string;
		storage_location: string;
		category: string;
		footprint: string;
		ipn: string;
	}
}

export namespace Footprint {
	// export interface ReqGetFootprintListParams extends ReqList {}
	export type ReqGetFootprintListParams = ReqList;
	export interface ResGetFootprintRecord extends ResGetRecord {
		id: string;
		created: string;
		updated: string;
		name: string;
		description: number;
	}
}

export namespace Category {
	// export interface ReqGetFootprintListParams extends ReqList {}
	export type ReqGetCategoryListParams = ReqList;
	export interface ResGetCategoryRecord extends ResGetRecord {
		id: string;
		created: string;
		updated: string;
		name: string;
		parent: string;
		description: number;
		_fullName: string;
	}
}

export namespace Storage {
	// export interface ReqGetFootprintListParams extends ReqList {}
	export type ReqGetStorageListParams = ReqList;
	export interface ResGetStorageRecord extends ResGetRecord {
		id: string;
		created: string;
		updated: string;
		name: string;
		description: number;
	}
}
