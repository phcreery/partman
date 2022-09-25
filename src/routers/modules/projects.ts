import { RouteRecordRaw } from "vue-router";
import { Layout } from "@/routers/constant";

// Homepage module
const homeRouter: Array<RouteRecordRaw> = [
	{
		path: "/projects",
		component: Layout,
		redirect: "/projects/index",
		children: [
			{
				path: "index",
				name: "projects",
				component: () => import("@/views/projects/projects.vue"),
				meta: {
					keepAlive: false,
					requiresAuth: true,
					title: "Projects",
					key: "projects"
				}
			}
		]
	}
];

export default homeRouter;
