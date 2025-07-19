/**
 * @description：请求配置
 */
export enum ResultEnum {
  SUCCESS = 200,
  NO_CONTENT = 204,
  ERROR = 500,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  TIMEOUT = 30000,
  TYPE = "success"
}

/**
 * @description：常用的 contentTyp 类型
 */
export enum ContentTypeEnum {
  // json
  JSON = "application/json;charset=UTF-8",
  // text
  TEXT = "text/plain;charset=UTF-8",
  // form-data 一般配合qs
  FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
  // form-data 上传
  FORM_DATA = "multipart/form-data;charset=UTF-8"
}
