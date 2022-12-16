<template>
	<el-drawer v-model="drawerVisible" title="Layout settings" size="300px">
		<!-- Layout switching -->
		<el-divider class="divider" content-position="center">
			<el-icon><Notification /></el-icon>
			Layout switching
		</el-divider>
		<div class="layout-box">
			<el-tooltip effect="dark" content="Vertical" placement="top" :show-after="200">
				<div
					:class="['layout-item layout-vertical', themeConfig.layout == 'vertical' ? 'is-active' : '']"
					@click="changeLayout('vertical')"
				>
					<div class="layout-dark"></div>
					<div class="layout-container">
						<div class="layout-light"></div>
						<div class="layout-content"></div>
					</div>
					<el-icon v-if="themeConfig.layout == 'vertical'"><CircleCheckFilled /></el-icon>
				</div>
			</el-tooltip>
			<el-tooltip effect="dark" content="Classic" placement="top" :show-after="200">
				<div
					:class="['layout-item layout-classic', themeConfig.layout == 'classic' ? 'is-active' : '']"
					@click="changeLayout('classic')"
				>
					<div class="layout-dark"></div>
					<div class="layout-container">
						<div class="layout-light"></div>
						<div class="layout-content"></div>
					</div>
					<el-icon v-if="themeConfig.layout == 'classic'"><CircleCheckFilled /></el-icon>
				</div>
			</el-tooltip>
			<el-tooltip effect="dark" content="Horizontal" placement="top" :show-after="200">
				<div
					:class="['layout-item layout-transverse', themeConfig.layout == 'transverse' ? 'is-active' : '']"
					@click="changeLayout('transverse')"
				>
					<div class="layout-dark"></div>
					<div class="layout-content"></div>
					<el-icon v-if="themeConfig.layout == 'transverse'"><CircleCheckFilled /></el-icon>
				</div>
			</el-tooltip>
			<el-tooltip effect="dark" content="Subcolumn" placement="top" :show-after="200">
				<div
					:class="['layout-item layout-columns', themeConfig.layout == 'columns' ? 'is-active' : '']"
					@click="changeLayout('columns')"
				>
					<div class="layout-dark"></div>
					<div class="layout-light"></div>
					<div class="layout-content"></div>
					<el-icon v-if="themeConfig.layout == 'columns'"><CircleCheckFilled /></el-icon>
				</div>
			</el-tooltip>
		</div>
		<br />

		<!-- Global Topics -->
		<el-divider class="divider" content-position="center">
			<el-icon><ColdDrink /></el-icon>
			Global Topics
		</el-divider>
		<div class="theme-item">
			<span>Theme Color</span>
			<el-color-picker v-model="themeConfig.primary" :predefine="colorList" @change="changePrimary" />
		</div>
		<div class="theme-item">
			<span>Dark Mode</span>
			<SwitchDark></SwitchDark>
		</div>
		<div class="theme-item">
			<span>Grey Mode</span>
			<el-switch v-model="themeConfig.isGrey" @change="changeGreyOrWeak($event, 'grey')" />
		</div>
		<div class="theme-item">
			<span>Color vision mode</span>
			<el-switch v-model="themeConfig.isWeak" @change="changeGreyOrWeak($event, 'weak')" />
		</div>
		<br />

		<!-- Interface Settings -->
		<el-divider class="divider" content-position="center">
			<el-icon><Setting /></el-icon>
			Interface Settings
		</el-divider>
		<div class="theme-item">
			<span>Folded Menu</span>
			<el-switch v-model="themeConfig.isCollapse" />
		</div>
		<div class="theme-item">
			<span>Breadcrumbs</span>
			<el-switch v-model="themeConfig.breadcrumb" />
		</div>
		<div class="theme-item">
			<span>Breadcrumb icon</span>
			<el-switch v-model="themeConfig.breadcrumbIcon" />
		</div>
		<div class="theme-item">
			<span>Label field</span>
			<el-switch v-model="themeConfig.tabs" />
		</div>
		<div class="theme-item">
			<span>Tab bar icon</span>
			<el-switch v-model="themeConfig.tabsIcon" />
		</div>
		<div class="theme-item">
			<span>Footer</span>
			<el-switch v-model="themeConfig.footer" />
		</div>
	</el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useTheme } from "@/hooks/useTheme";
import { GlobalStore } from "@/stores";
import { DEFAULT_PRIMARY } from "@/config/config";
import SwitchDark from "@/components/SwitchDark/index.vue";
import mittBus from "@/utils/mittBus";

const { changePrimary, changeGreyOrWeak } = useTheme();

// Predefined theme colors
const colorList = [
	DEFAULT_PRIMARY,
	"#DAA96E",
	"#0C819F",
	"#409EFF",
	"#27ae60",
	"#ff5c93",
	"#e74c3c",
	"#fd726d",
	"#f39c12",
	"#9b59b6"
];

const globalStore = GlobalStore();
const themeConfig = computed(() => globalStore.themeConfig);

// Toggle layout method
const changeLayout = (val: string) => {
	globalStore.setThemeConfig({ ...themeConfig.value, layout: val });
};

// Listening for layout changes，In body Add the corresponding layout class
watch(
	() => themeConfig.value.layout,
	() => {
		const body = document.body as HTMLElement;
		body.setAttribute("class", themeConfig.value.layout);
	},
	{ immediate: true }
);

// Open theme settings
const drawerVisible = ref(false);
mittBus.on("openThemeDrawer", () => (drawerVisible.value = true));
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
