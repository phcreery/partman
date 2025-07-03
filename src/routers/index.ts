import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/modules/user";
import { useAuthStore } from "@/stores/modules/auth";
import { LOGIN_URL, ROUTER_WHITE_LIST } from "@/config";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { staticRouter, errorRouter } from "@/routers/modules/staticRouter";
import NProgress from "@/config/nprogress";

const mode = import.meta.env.VITE_ROUTER_MODE;

const routerMode = {
  hash: () => createWebHashHistory(),
  history: () => createWebHistory()
};

/**
 * @description 📚 Router parameter configuration introduction
 * @param path ==> Route menu access path
 * @param name ==> Route name (corresponds to the page component name, can be used as KeepAlive cache identifier && button permission filtering)
 * @param redirect ==> Route redirect address
 * @param component ==> View file path
 * @param meta ==> Route menu meta information
 * @param meta.icon ==> Icon for menu and breadcrumb
 * @param meta.title ==> Route title (used for document.title || menu name)
 * @param meta.activeMenu ==> When the current route is a detail page, the menu to be highlighted
 * @param meta.isLink ==> Access address for external links
 * @param meta.isHide ==> Whether to hide in the menu (usually list detail pages need to be hidden)
 * @param meta.isFull ==> Whether the menu is full screen (example: data dashboard page)
 * @param meta.isAffix ==> Whether the menu is fixed in the tab (home page is usually fixed)
 * @param meta.isKeepAlive ==> Whether the current route is cached
 * */
const router = createRouter({
  // history: routerMode[mode](),
  history: createWebHashHistory(),
  routes: [...staticRouter, ...errorRouter],
  strict: false,
  scrollBehavior: () => ({ left: 0, top: 0 })
});

/**
 * @description Route interception beforeEach
 * */
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const authStore = useAuthStore();

  // 1. NProgress start
  NProgress.start();

  // 2. Dynamically set title
  const title = import.meta.env.VITE_GLOB_APP_TITLE;
  document.title = to.meta.title ? `${to.meta.title} - ${title}` : title;

  // 3. If visiting login page, if there is a Token stay on current page, if not reset router to login page
  if (to.path.toLocaleLowerCase() === LOGIN_URL) {
    if (userStore.token) return next(from.fullPath);
    resetRouter();
    return next();
  }

  // 4. If the accessed page is in the route whitelist (static routes), allow directly
  if (ROUTER_WHITE_LIST.includes(to.path)) return next();

  // 5. If there is no Token, redirect to login page
  if (!userStore.token) return next({ path: LOGIN_URL, replace: true });

  // 6. If there is no menu list, request the menu list again and add dynamic routes
  if (!authStore.authMenuListGet.length) {
    await initDynamicRouter();
    return next({ ...to, replace: true });
  }

  // 7. Store routerName for button permission filtering
  authStore.setRouteName(to.name as string);

  // 8. Normal page access
  next();
});

/**
 * @description Reset router
 * */
export const resetRouter = () => {
  const authStore = useAuthStore();
  authStore.flatMenuListGet.forEach(route => {
    const { name } = route;
    if (name && router.hasRoute(name)) router.removeRoute(name);
  });
};

/**
 * @description Router navigation error
 * */
router.onError(error => {
  NProgress.done();
  console.error("Router error", error.message);
});

/**
 * @description Router navigation end
 * */
router.afterEach(() => {
  NProgress.done();
});

export default router;
