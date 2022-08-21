import { RouteRecordRaw, RouteRecordName } from "vue-router";
import { routerArray } from "@/routers/router";

/**
 * @description Use recursively, filtering the route that needs to be cached
 * @param {Array} _route All routing table
 * @param {Array} _cache Cache route table
 * @return void
 * */
let cacheRouter: any[] = [];
const filterKeepAlive = (_route: RouteRecordRaw[], _cache: RouteRecordName[]): void => {
	_route.forEach(item => {
		item.meta?.keepAlive && item.name && _cache.push(item.name);
		item.children && item.children.length !== 0 && filterKeepAlive(item.children, _cache);
	});
};

filterKeepAlive(routerArray, cacheRouter);

export default cacheRouter;
