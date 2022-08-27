import { RouteRecordRaw } from "vue-router";
import { Layout } from "@/routers/constant";

// Homepage module
const homeRouter: Array<RouteRecordRaw> = [
	{
		path: "/storage",
		component: Layout,
		redirect: "/storage/index",
		children: [
			{
				path: "index",
				name: "storage",
				component: () => import("@/views/storage/storage.vue"),
				meta: {
					keepAlive: false,
					requiresAuth: true,
					title: "Storage",
					key: "storage"
				}
			}
		]
	}
];

export default homeRouter;
