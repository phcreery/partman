import type { ListResult } from "pocketbase";
import type { ReqList } from "@/api/interface/index";

export const emptyData = (params?: ReqList): ListResult<null> => {
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
export const filterToPBString = (filter: { [propName: string]: any }) => {
  // console.log("filter", filter);
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
  // console.log("filter string", s);
  return s;
};

/* 
Function that converts a list of tree items that have 'parent id' relations and returns a full tree name for specified item
*/
export const getPathName = (
  data: any[],
  id: string,
  identifier = "id",
  parentIdentifier = "parent",
  path: string[] = []
): string => {
  const found = data.find(element => element[identifier] === id);
  path.push(found.name);
  const parent = data.find(element => element[identifier] === found[parentIdentifier]);
  if (!parent) {
    return path.reverse().join(" ▸ "); // / > ‣ → ▻ ▸ ▶ ▷
  }
  return getPathName(data, parent[identifier], identifier, parentIdentifier, path);
};
