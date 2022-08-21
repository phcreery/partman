<template>
	<div class="menu" :style="{ width: isCollapse ? '65px' : '220px' }" v-loading="loading" element-loading-text="Loading...">
		<Logo :isCollapse="isCollapse"></Logo>
		<el-scrollbar>
			<el-menu
				:default-active="activeMenu"
				:router="true"
				:collapse="isCollapse"
				:collapse-transition="false"
				:unique-opened="true"
				background-color="#191a20"
				text-color="#bdbdc0"
				active-text-color="#fff"
			>
				<SubItem :menuList="menuList"></SubItem>
			</el-menu>
		</el-scrollbar>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { MenuStore } from "@/store/modules/menu";
import { AuthStore } from "@/store/modules/auth";
import { getMenuList } from "@/api/modules/login";
import { handleRouter } from "@/utils/util";
import Logo from "./components/Logo.vue";
import SubItem from "./components/SubItem.vue";

const route = useRoute();
const menuStore = MenuStore();
const authStore = AuthStore();

// Menu load loading
const loading = ref(false);

onMounted(async () => {
	// Get the menu list
	loading.value = true;
	// await new Promise(res => setTimeout(res, 3000));
	try {
		const res = await getMenuList();
		if (!res.data) return;
		// Treat the route menu into one -dimensional array (store in Pinia)
		const dynamicRouter = handleRouter(res.data);
		authStore.setAuthRouter(dynamicRouter);
		menuStore.setMenuList(res.data);
	} finally {
		loading.value = false;
	}
});

const activeMenu = computed((): string => route.path);
const isCollapse = computed((): boolean => menuStore.isCollapse);
const menuList = computed((): Menu.MenuOptions[] => menuStore.menuList);

// ASIDE adaptive
const screenWidth = ref<number>(0);
// The size of the monitoring window changes, merge ASIDE
const listeningWindow = () => {
	window.onresize = () => {
		return (() => {
			screenWidth.value = document.body.clientWidth;
			if (isCollapse.value === false && screenWidth.value < 1200) menuStore.setCollapse();
			if (isCollapse.value === true && screenWidth.value > 1200) menuStore.setCollapse();
		})();
	};
};
listeningWindow();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
