// * Request enumeration configuration
/**
 * @description：Request configuration
 */
export enum ResultEnum {
	SUCCESS = 200,
	BADREQ = 400,
	FORBIDDEN = 403,
	ERROR = 500,
	OVERDUE = 599,
	TIMEOUT = 10000,
	TYPE = "success"
}

/**
 * @description：Method of requesting
 */
export enum RequestEnum {
	GET = "GET",
	POST = "POST",
	PATCH = "PATCH",
	PUT = "PUT",
	DELETE = "DELETE"
}

/**
 * @description：Commonly used ContentTyp type
 */
export enum ContentTypeEnum {
	// json
	JSON = "application/json;charset=UTF-8",
	// text
	TEXT = "text/plain;charset=UTF-8",
	// form-data General with QS
	FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
	// form-data Upload
	FORM_DATA = "multipart/form-data;charset=UTF-8"
}
