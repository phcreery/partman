import { RouteRecordRaw } from "vue-router";
import { Layout } from "@/routers/constant";

// Homepage module
const homeRouter: Array<RouteRecordRaw> = [
  {
    path: "/settings",
    component: Layout,
    redirect: "/settings/index",
    children: [
      {
        path: "index",
        name: "settings",
        component: () => import("@/views/settings/general.vue"),
        meta: {
          keepAlive: true,
          requiresAuth: true,
          title: "Settings",
          key: "settings"
        }
      },
      {
        path: "logs",
        name: "logs",
        component: () => import("@/views/settings/logs.vue"),
        meta: {
          keepAlive: true,
          requiresAuth: true,
          title: "Logs",
          key: "logs"
        }
      }
    ]
  }
];

export default homeRouter;
