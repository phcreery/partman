import { ResPage, User } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";

import http from "@/api";

/**
 * @name User management module
 */
// * Get the user list
export const getUserList = (params: User.ReqGetUserParams) => {
	return http.post<ResPage<User.ResUserList>>(PORT1 + `/user/list`, params);
};

// * New users
export const addUser = (params: { id: string }) => {
	return http.post(PORT1 + `/user/add`, params);
};

// * Add users in batches
export const BatchAddUser = (params: any) => {
	return http.post(PORT1 + `/user/import`, params);
};

// * Edit user
export const editUser = (params: { id: string }) => {
	return http.post(PORT1 + `/user/edit`, params);
};

// * delete users
export const deleteUser = (params: { id: string[] }) => {
	return http.post(PORT1 + `/user/delete`, params);
};

// * Switch user status
export const changeUserStatus = (params: { id: string; status: number }) => {
	return http.post(PORT1 + `/user/change`, params);
};

// * Reset the user password
export const resetUserPassWord = (params: { id: string }) => {
	return http.post(PORT1 + `/user/rest_password`, params);
};

// * Export user data
export const exportUserInfo = (params: User.ReqGetUserParams) => {
	return http.post<BlobPart>(PORT1 + `/user/export`, params, { responseType: "blob" });
};

// * Get user status
export const getUserStatus = () => {
	return http.get<User.ResStatus>(PORT1 + `/user/status`);
};

// * Get user gender dictionary
export const getUserGender = () => {
	return http.get<User.ResGender>(PORT1 + `/user/gender`);
};
