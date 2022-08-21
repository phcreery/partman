import { RouteRecordRaw } from "vue-router";
import { Layout } from "@/routers/constant";

// Homepage module
const homeRouter: Array<RouteRecordRaw> = [
	{
		path: "/footprints",
		component: Layout,
		redirect: "/footprints/index",
		children: [
			{
				path: "index",
				name: "footprints",
				component: () => import("@/views/footprints/footprints.vue"),
				meta: {
					keepAlive: false,
					requiresAuth: true,
					title: "Footprints",
					key: "footprints"
				}
			}
		]
	}
];

export default homeRouter;
