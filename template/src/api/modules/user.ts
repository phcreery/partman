import http from '@/api'
import { SERVER_ENDPOINTS } from '@/constants'

export interface ReqUserParams extends RequestPage {
  username: string
  gender: number
  idCard: string
  email: string
  address: string
  createTime: string[]
  status: number
}
export interface ResUserList {
  id: string
  username: string
  gender: number
  user: { detail: { age: number } }
  idCard: string
  email: string
  address: string
  createTime: string
  status: number
  avatar: string
  photo: any[]
  children?: ResUserList[]
}
export interface ResStatus {
  userLabel: string
  userValue: number
}
export interface ResGender {
  genderLabel: string
  genderValue: number
}
export interface ResDepartment {
  id: string
  name: string
  children?: ResDepartment[]
}
export interface ResRole {
  id: string
  name: string
  children?: ResDepartment[]
}
/**
 * @name 用户管理模块
 */
// 获取用户列表
export const getUserList = (params: ReqUserParams) => {
  return http.post<ResultPage<ResUserList>>(SERVER_ENDPOINTS.geeker + `/user/list`, params)
}

// 获取树形用户列表
export const getUserTreeList = (params: ReqUserParams) => {
  return http.post<ResultPage<ResUserList>>(SERVER_ENDPOINTS.geeker + `/user/tree/list`, params)
}

// 新增用户
export const addUser = (params: { id: string }) => {
  return http.post(SERVER_ENDPOINTS.geeker + `/user/add`, params)
}

// 批量添加用户
export const BatchAddUser = (params: FormData) => {
  return http.post(SERVER_ENDPOINTS.geeker + `/user/import`, params)
}

// 编辑用户
export const editUser = (params: { id: string }) => {
  return http.post(SERVER_ENDPOINTS.geeker + `/user/edit`, params)
}

// 删除用户
export const deleteUser = (params: { id: string[] }) => {
  return http.post(SERVER_ENDPOINTS.geeker + `/user/delete`, params)
}

// 切换用户状态
export const changeUserStatus = (params: { id: string; status: number }) => {
  return http.post(SERVER_ENDPOINTS.geeker + `/user/change`, params)
}

// 重置用户密码
export const resetUserPassWord = (params: { id: string }) => {
  return http.post(SERVER_ENDPOINTS.geeker + `/user/rest_password`, params)
}

// 导出用户数据
export const exportUserInfo = (params: ReqUserParams) => {
  return http.download(SERVER_ENDPOINTS.geeker + `/user/export`, params)
}

// 获取用户状态字典
export const getUserStatus = () => {
  return http.get<ResStatus[]>(SERVER_ENDPOINTS.geeker + `/user/status`)
}

// 获取用户性别字典
export const getUserGender = () => {
  return http.get<ResGender[]>(SERVER_ENDPOINTS.geeker + `/user/gender`)
}

// 获取用户部门列表
export const getUserDepartment = () => {
  return http.get<ResDepartment[]>(SERVER_ENDPOINTS.geeker + `/user/department`, {}, { cancel: false })
}

// 获取用户角色字典
export const getUserRole = () => {
  return http.get<ResRole[]>(SERVER_ENDPOINTS.geeker + `/user/role`)
}
