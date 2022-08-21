<template>
	<el-dropdown trigger="click" @command="setAssemblySize">
		<span>
			<el-tooltip effect="dark" content="Component size" placement="bottom">
				<i :class="'iconfont icon-contentright'" class="icon-style"></i>
			</el-tooltip>
		</span>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item v-for="item in assemblySizeList" :key="item" :disabled="assemblySize === item" :command="item">
					{{ assemblySizeListCh[item] }}
				</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { GlobalStore } from "@/store";

const globalStore = GlobalStore();
const assemblySize = computed((): string => globalStore.assemblySize);

const assemblySizeListCh = reactive<{ [propName: string]: any }>({
	default: "Default",
	large: "Large",
	small: "Small"
});

const assemblySizeList = reactive<string[]>(["default", "large", "small"]);

const setAssemblySize = (item: "default" | "large" | "small") => {
	if (assemblySize.value === item) return;
	globalStore.setAssemblySizeSize(item);
};
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
