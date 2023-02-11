import { Login, APIdata } from "@/api/interface/index";
// import Menu from "@/assets/json/menu.json";
// import qs from "qs";

// import http from "@/api";
import client from "@/api";

/**
 * @name Login module
 */
// * User login interface
export const loginApi = async (params: Login.ReqLoginParams): Promise<APIdata<Login.ResLogin>> => {
  // return http.post<Login.ResLogin>(PORT1 + `/login`, params); // normal post json ask  ==>  application/json
  // return http.post<Login.ResLogin>(PORT1 + `/login`, {}, { params }); // post Request to carry Query parameter  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(PORT1 + `/login`, qs.stringify(params)); // post Request to carry form parameters  ==>  application/x-www-form-urlencoded
  // return http.post<Login.ResLogin>(PORT1 + `/login`, params, { headers: { noLoading: true } }); // Control the current request does not display loading
  const authData = await client.collection("users").authWithPassword(params.username, params.password);
  // authData.user = await client.collection("users").getOne(authData.record.id);
  // console.log("authData", authData);
  return { data: authData };
};

export const loginApiAsAdmin = async (params: Login.ReqLoginParams): Promise<Login.ResLogin> => {
  const adminAuthData = (await client.admins.authWithPassword(params.username, params.password)) as any;
  adminAuthData.user = adminAuthData.admin;
  // console.log("adminAuthData", adminAuthData);
  return adminAuthData;
};

// * 用户退出登录
export const logoutApi = () => {
  return null; // http.post<Login.ResLogout>(PORT1 + `/logout`);
};

// * Get the button permissions
export const getAuthButtonListApi = (): Login.ResAuthButtons => {
  // return http.get<Login.ResAuthButtons>(PORT1 + `/auth/buttons`);
  // return {
  //   code: 200,
  //   msg: "success",
  //   data: {
  //     inventory: ["add", "batchAdd", "export", "batchDelete", "status", "view", "edit", "reset", "delete"],
  //     footprints: ["add", "delete", "view", "edit"],
  //     storage: ["add", "delete", "view", "edit"],
  //     categories: ["add", "delete", "view", "edit"],
  //     projects: ["add", "delete", "view", "edit", "batchAdd", "export"]
  //   }
  // };
  return {
    code: 200,
    msg: "success",
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
        delete: true,
        merge: true
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
      logs: {
        export: true
      }
      // users: {
      //   add: true,
      //   delete: true,
      //   view: true,
      //   edit: true,
      //   batchAdd: true,
      //   export: true
      // }
    }
  };
};

// * Get the menu list
export const getAuthMenuListApi = () => {
  // return http.get<Menu.MenuOptions[]>(PORT1 + `/menu/list`);
  // If you want to make the menu into local data, comment on the line of code on the previous line, and introduce the local Menu.json data
  let res = {
    code: 200,
    msg: "success",
    data: [
      {
        path: "/home",
        name: "home",
        component: "/home/index",
        meta: {
          icon: "home-filled",
          title: "Home",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: true,
          isKeepAlive: true
        }
      },
      {
        path: "/inventory",
        name: "inventory",
        component: "/inventory/index",
        meta: {
          icon: "cpu",
          title: "Inventory",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        },
        children: []
      },
      {
        path: "/categories",
        name: "categories",
        component: "/categories/index",
        meta: {
          icon: "folder",
          title: "Categories",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        }
      },
      {
        path: "/footprints",
        name: "footprints",
        component: "/footprints/index",
        meta: {
          icon: "menu",
          title: "Footprints",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        },
        children: []
      },
      {
        path: "/storage",
        name: "storage",
        component: "/storage/index",
        meta: {
          icon: "TakeawayBox",
          title: "Storage",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        },
        children: []
      },
      {
        path: "/projects",
        name: "projects",
        component: "/projects/index",
        meta: {
          icon: "odometer",
          title: "Projects",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        },
        children: []
      },
      {
        path: "/settings",
        name: "settings",
        component: "/settings/general",
        meta: {
          icon: "setting",
          title: "Settings",
          isLink: "",
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true
        },
        children: [
          {
            path: "/settings",
            name: "settings",
            component: "/settings/general",
            meta: {
              icon: "setting",
              title: "Settings",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: true
            },
            children: []
          },
          {
            path: "/logs",
            name: "logs",
            component: "/settings/logs",
            meta: {
              icon: "DataAnalysis",
              title: "Logs",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: true
            },
            children: []
          }
        ]
      }
      // {
      //   title: "Settings",
      //   path: "/settings",
      //   icon: "setting",
      //   children: [
      //     // {
      //     //   title: "Users",
      //     //   path: "/users/index",
      //     //   icon: "user"
      //     // },
      //     {
      //       title: "General",
      //       path: "/settings/general",
      //       icon: "setting"
      //     },
      //     // {
      //     //   title: "Export",
      //     //   path: "/404",
      //     //   icon: "Download"
      //     // },
      //     // {
      //     //   title: "Import",
      //     //   path: "/404",
      //     //   icon: "Upload"
      //     // }
      //     {
      //       title: "Logs",
      //       path: "/settings/logs",
      //       icon: "clock"
      //     }
      //   ]
      // }
    ]
  };
  return res; //.data;
};
