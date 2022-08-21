import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

// * Import all Router
const metaRouters = import.meta.globEager("./modules/*.ts");

// * Processing routing table
export const routerArray: RouteRecordRaw[] = [];
Object.keys(metaRouters).forEach(item => {
	Object.keys(metaRouters[item]).forEach((key: any) => {
		routerArray.push(...metaRouters[item][key]);
	});
});

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		redirect: { name: "login" }
	},
	{
		path: "/login",
		name: "login",
		component: () => import("@/views/login/index.vue"),
		meta: {
			requiresAuth: false,
			title: "Login page",
			key: "login"
		}
	},
	...routerArray,
	{
		// Can't find the route redirection to page 404
		path: "/:pathMatch(.*)",
		redirect: { name: "404" }
	}
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
	strict: false,
	// Switch the page, roll to the top
	scrollBehavior: () => ({ left: 0, top: 0 })
});

export default router;
