import { RouteRecordRaw } from "vue-router";
import { Layout } from "@/routers/constant";

// Homepage module
const homeRouter: Array<RouteRecordRaw> = [
	{
		path: "/categories",
		component: Layout,
		redirect: "/categories/index",
		children: [
			{
				path: "index",
				name: "categories",
				component: () => import("@/views/categories/categories.vue"),
				meta: {
					keepAlive: false,
					requiresAuth: true,
					title: "Categories",
					key: "categories"
				}
			}
		]
	}
];

export default homeRouter;
