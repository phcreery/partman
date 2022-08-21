import { RouteRecordRaw } from "vue-router";

// Error page module
const errorRouter: Array<RouteRecordRaw> = [
	{
		path: "/403",
		name: "403",
		component: () => import("@/components/ErrorMessage/403.vue"),
		meta: {
			requiresAuth: true,
			title: "Page 403",
			key: "403"
		}
	},
	{
		path: "/404",
		name: "404",
		component: () => import("@/components/ErrorMessage/404.vue"),
		meta: {
			requiresAuth: false,
			title: "Page 404",
			key: "404"
		}
	},
	{
		path: "/500",
		name: "500",
		component: () => import("@/components/ErrorMessage/500.vue"),
		meta: {
			requiresAuth: false,
			title: "Page 500",
			key: "500"
		}
	}
];

export default errorRouter;
