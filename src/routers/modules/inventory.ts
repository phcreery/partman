import { RouteRecordRaw } from "vue-router";
import { Layout } from "@/routers/constant";

// Homepage module
const homeRouter: Array<RouteRecordRaw> = [
	{
		path: "/inventory",
		component: Layout,
		redirect: "/inventory/index",
		children: [
			{
				path: "index",
				name: "inventory",
				component: () => import("@/views/inventory/inventory.vue"),
				meta: {
					keepAlive: true,
					requiresAuth: true,
					title: "Inventory",
					key: "inventory"
				}
			}
		]
	}
];

export default homeRouter;
