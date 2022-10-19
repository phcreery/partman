import { Login } from "@/api/interface/index";
// import { PORT1 } from "@/api/config/servicePort";
import Menu from "@/assets/json/menu.json";
// import qs from "qs";

// import http from "@/api";
import client from "@/api";

/**
 * @name Login module
 */
// * User login interface
export const loginApi = async (params: Login.ReqLoginParams): Promise<Login.ResLogin> => {
  // return http.post<Login.ResLogin>(PORT1 + `/login`, params); // normal post json ask  ==>  application/json
  // return http.post<Login.ResLogin>(PORT1 + `/login`, {}, { params }); // post Request to carry Query parameter  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(PORT1 + `/login`, qs.stringify(params)); // post Request to carry form parameters  ==>  application/x-www-form-urlencoded
  // return http.post<Login.ResLogin>(PORT1 + `/login`, params, { headers: { noLoading: true } }); // Control the current request does not display loading
  const authData = await client.users.authViaEmail(params.username, params.password);
  return authData;
};

// * Get the button permissions
export const getAuthButtons = () => {
  // return http.get<Login.ResAuthButtons>(PORT1 + `/auth/buttons`);
  return {
    code: 200,
    data: {
      inventory: {
        add: true,
        batchAdd: true,
        export: true,
        batchDelete: true,
        status: true,
        view: true,
        edit: true,
        reset: true,
        delete: true
      },
      footprints: {
        add: true,
        delete: true,
        view: true,
        edit: true
      },
      storage: {
        add: true,
        delete: true,
        view: true,
        edit: true
      },
      categories: {
        add: true,
        delete: true,
        view: true,
        edit: true
      },
      projects: {
        add: true,
        delete: true,
        view: true,
        edit: true,
        batchAdd: true,
        export: true
      },
      users: {
        add: true,
        delete: true,
        view: true,
        edit: true,
        batchAdd: true,
        export: true
      }
    },
    msg: "success"
  };
};

// * Get the menu list
export const getMenuList = () => {
  // return http.get<Menu.MenuOptions[]>(PORT1 + `/menu/list`);
  // If you want to make the menu into local data, comment on the line of code on the previous line, and introduce the local Menu.json data
  return Menu;
};
