<template>
	<div>
		<el-tooltip effect="dark" content="About" placement="bottom">
			<!-- <i :class="'iconfont icon-zhuti'" class="icon-style" @click="openDrawer"></i> -->
			<el-icon class="icon-style el-icon" @click="openDrawer"><InfoFilled /></el-icon>
		</el-tooltip>
		<el-drawer v-model="drawerVisible" title="About" size="300px">
			<el-divider class="divider" content-position="center">
				<div class="divider-content">About partman</div>
			</el-divider>
		</el-drawer>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { InfoFilled } from "@element-plus/icons-vue";

// Open the theme settings
const drawerVisible = ref(false);
const openDrawer = () => {
	drawerVisible.value = true;
};
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
