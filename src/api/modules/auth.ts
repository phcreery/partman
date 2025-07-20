import { AsyncAuthStore, AuthRecord } from "pocketbase";
import { useUserStore } from "@/stores/modules/user";
import type { MenuOptions } from "@/api/modules/menu";
import { Login } from "@/api/interface/index";
import { HOME_URL } from "@/config";
// import client from "@/api";

interface SerializedData {
  token: string;
  record: Partial<AuthRecord>;
}

const getInitialAuthRecord = async (): Promise<string> => {
  // wait for pinia store to be ready
  await new Promise(resolve => setTimeout(resolve, 0));
  const userStore = useUserStore();
  const payload: SerializedData = {
    token: userStore.token,
    record: {
      id: userStore.id,
      email: userStore.email,
      avatar: userStore.avatar,
      username: userStore.username || userStore.email,
      collectionName: userStore.collectionName
    }
  };
  // console.log("getInitialAuthRecord", payload);
  return JSON.stringify({ token: userStore.token, record: payload });
};

export const store = new AsyncAuthStore({
  save: async serialized => {
    let { token, record }: SerializedData = JSON.parse(serialized);
    if (!token || !record) {
      console.error("No token or record found in serialized data");
      return;
    }
    // console.log("store save", token, record);
    const userStore = useUserStore();
    userStore.setToken(token);
    if (!record.id) {
      console.error("No user ID found in PB AuthStore record, will not set user info");
      return;
    }
    userStore.setUserInfo({
      id: record.id,
      email: record.email!,
      avatar: record.avatar!,
      username: record.username || record.email!,
      collectionName: record.collectionName!
    });
  },
  initial: getInitialAuthRecord()
});

// * Get the button permissions
export const getAuthButtonListApi = (): Login.ResAuthButtons => {
  const res: Login.ResAuthButtons = {
    inventory: ["add", "delete", "view", "edit", "batchAdd", "batchDelete", "export", "status", "reset", "merge"],
    categories: ["add", "delete", "view", "edit"],
    footprints: ["add", "delete", "view", "edit"],
    storage: ["add", "delete", "view", "edit"],
    projects: ["add", "delete", "view", "edit", "batchAdd", "batchDelete", "export"],
    builds: ["add", "delete", "view", "edit", "export"],
    logs: ["export"],
    users: ["add", "delete", "view", "edit", "batchAdd", "export", "batchDelete"],
    backups: ["add", "delete", "restore", "export", "import", "batchDelete"]
  };
  return res;
};

// * Get the menu list
export const getAuthMenuListApi = (): MenuOptions[] => {
  // return http.get<Menu.MenuOptions[]>(PORT1 + `/menu/list`);
  // If you want to make the menu into local data, comment on the line of code on the previous line, and introduce the local Menu.json data
  const res: MenuOptions[] = [
    {
      path: HOME_URL,
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
    }
  ];

  const userStore = useUserStore();
  if (userStore.isSuperuser) {
    res.push({
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
        },
        {
          path: "/settings/backups",
          name: "backups",
          component: "/settings/backups/index",
          meta: {
            icon: "Suitcase",
            title: "Backups",
            isLink: "",
            isHide: false,
            isFull: false,
            isAffix: false,
            isKeepAlive: true
          },
          children: []
        }
      ]
    });
  }

  return res;
};
