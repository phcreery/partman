import { Login, ResultData } from "@/api/interface/index";
import type { MenuOptions } from "@/api/modules/menu";
import client from "@/api";
import { HOME_URL } from "@/config";

/**
 * @name Login module
 */
// * User login interface
export const loginApi = async (params: Login.ReqLoginForm): Promise<Login.ResLogin> => {
  const authData = await client.collection("users").authWithPassword(params.username, params.password);
  return authData as unknown as Login.ResLogin;
};

export const loginApiAsAdmin = async (params: Login.ReqLoginForm): Promise<Login.ResLogin> => {
  const adminAuthData = await client.collection("_superusers").authWithPassword(params.username, params.password);
  return adminAuthData as unknown as Login.ResLogin;
};

// * User logout
export const logoutApi = () => {
  return null;
};

// * Get the button permissions
export const getAuthButtonListApi = (): Login.ResAuthButtons => {
  const res: ResultData<Login.ResAuthButtons> = {
    code: 200,
    msg: "success",
    data: {
      inventory: ["add", "delete", "view", "edit", "batchAdd", "batchDelete", "export", "status", "reset", "merge"],
      categories: ["add", "delete", "view", "edit"],
      footprints: ["add", "delete", "view", "edit"],
      storage: ["add", "delete", "view", "edit"],
      projects: ["add", "delete", "view", "edit", "batchAdd", "batchDelete", "export"],
      builds: ["add", "delete", "view", "edit", "export"],
      logs: ["export"],
      users: ["add", "delete", "view", "edit", "batchAdd", "export", "batchDelete"]
    }
  };
  return res.data;
};

// * Get the menu list
export const getAuthMenuListApi = (): MenuOptions[] => {
  // return http.get<Menu.MenuOptions[]>(PORT1 + `/menu/list`);
  // If you want to make the menu into local data, comment on the line of code on the previous line, and introduce the local Menu.json data
  const res: ResultData<MenuOptions[]> = {
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
        path: "/builds",
        name: "builds",
        component: "/builds/index",
        meta: {
          icon: "promotion",
          title: "Builds",
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
        component: "/settings/admin/index",
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
            path: "/settings/admin",
            name: "admin",
            component: "/settings/admin/index",
            meta: {
              icon: "operation",
              title: "Admin",
              isLink: "",
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: true
            },
            children: []
          },
          {
            path: "/settings/logs",
            name: "logs",
            component: "/settings/logs/index",
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
          },
          {
            path: "/settings/users",
            name: "users",
            component: "/settings/users/index",
            meta: {
              icon: "UserFilled",
              title: "Users",
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
  return res.data;
};
