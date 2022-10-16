import { RouteRecordRaw } from "vue-router";
import { Layout } from "@/routers/constant";

// Homepage module
const homeRouter: Array<RouteRecordRaw> = [
  {
    path: "/users",
    component: Layout,
    redirect: "/users/index",
    children: [
      {
        path: "index",
        name: "users",
        component: () => import("@/views/users/users.vue"),
        meta: {
          keepAlive: true,
          requiresAuth: true,
          title: "Users",
          key: "users"
        }
      }
    ]
  }
];

export default homeRouter;
