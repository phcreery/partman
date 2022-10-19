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
      }
    ]
  }
];

export default homeRouter;
