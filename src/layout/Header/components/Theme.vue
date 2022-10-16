<template>
	<div>
		<el-tooltip effect="dark" content="Layout settings" placement="bottom">
			<i :class="'iconfont icon-zhuti'" class="icon-style" @click="openDrawer"></i>
		</el-tooltip>
		<el-drawer v-model="drawerVisible" title="Layout settings" size="300px">
			<el-divider class="divider" content-position="center">
				<div class="divider-content">
					<el-icon><ColdDrink /></el-icon>
					Global theme
				</div>
			</el-divider>
			<!-- <div class="theme-item">
				<span>Theme color</span>
				<el-color-picker v-model="themeConfig.primary" :predefine="colorList" @change="changePrimary"> </el-color-picker>
			</div> -->
			<div class="theme-item">
				<span>Dark theme</span>
				<SwitchDark></SwitchDark>
			</div>
			<div class="theme-item">
				<span>Grayscale</span>
				<el-switch v-model="themeConfig.isGrey" @change="changeGreyOrWeak($event, 'grey')" />
			</div>
			<div class="theme-item">
				<span>Invert</span>
				<el-switch v-model="themeConfig.isWeak" @change="changeGreyOrWeak($event, 'weak')" />
			</div>
			<br />
			<el-divider class="divider" content-position="center">
				<div class="divider-content">
					<el-icon><Setting /></el-icon>
					Interface settings
				</div>
			</el-divider>
			<div class="theme-item">
				<span>Fold menu</span>
				<el-switch v-model="isCollapse" />
			</div>
			<div class="theme-item">
				<span>Breadcrumbs</span>
				<el-switch v-model="themeConfig.breadcrumb" />
			</div>
			<div class="theme-item">
				<span>Tab bar</span>
				<el-switch v-model="themeConfig.tabs" />
			</div>
			<!-- <div class="theme-item">
				<span>Footer</span>
				<el-switch v-model="themeConfig.footer" />
			</div> -->
		</el-drawer>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useTheme } from "@/hooks/useTheme";
import SwitchDark from "@/components/SwitchDark/index.vue";
import { MenuStore } from "@/store/modules/menu";
import { GlobalStore } from "@/store";

// Pre -predetermined theme color
const colorList = ["#409EFF", "#DAA96E", "#0C819F", "#009688", "#27ae60", "#ff5c93", "#e74c3c", "#fd726d", "#f39c12", "#9b59b6"];

// Theme initialization
const globalStore = GlobalStore();
const themeConfig = computed(() => globalStore.themeConfig);

const menuStore = MenuStore();
const isCollapse = computed({
	get() {
		return menuStore.isCollapse;
	},
	set() {
		menuStore.setCollapse();
	}
});

const { changePrimary, changeGreyOrWeak } = useTheme();

// Open the theme settings
const drawerVisible = ref(false);
const openDrawer = () => {
	drawerVisible.value = true;
};
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
