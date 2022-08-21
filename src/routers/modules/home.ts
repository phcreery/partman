import { RouteRecordRaw } from "vue-router";
import { Layout } from "@/routers/constant";

// Homepage module
const homeRouter: Array<RouteRecordRaw> = [
	{
		path: "/home",
		component: Layout,
		redirect: "/home/index",
		children: [
			{
				path: "index",
				name: "home",
				component: () => import("@/views/home/index.vue"),
				meta: {
					keepAlive: true,
					requiresAuth: true,
					title: "Home",
					key: "home"
				}
			}
		]
	}
];

export default homeRouter;
