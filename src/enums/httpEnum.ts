// * Request Enumeration Configuration
/**
 * @description：Request Configuration
 */
export enum ResultEnum {
	SUCCESS = 200,
	ERROR = 500,
	OVERDUE = 599,
	TIMEOUT = 10000,
	TYPE = "success"
}

/**
 * @description：Request Method
 */
export enum RequestEnum {
	GET = "GET",
	POST = "POST",
	PATCH = "PATCH",
	PUT = "PUT",
	DELETE = "DELETE"
}

/**
 * @description：Commonly usedcontentTypType
 */
export enum ContentTypeEnum {
	// json
	JSON = "application/json;charset=UTF-8",
	// text
	TEXT = "text/plain;charset=UTF-8",
	// form-data General fitqs
	FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
	// form-data Upload
	FORM_DATA = "multipart/form-data;charset=UTF-8"
}
