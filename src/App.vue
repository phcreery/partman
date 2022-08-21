<template>
	<el-config-provider :locale="i18nLocale" :button="config" :size="assemblySize">
		<router-view></router-view>
	</el-config-provider>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { GlobalStore } from "@/store";
// Configure Element Chinese and English
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";
// Theme
import { useTheme } from "@/hooks/useTheme";
useTheme();

const globalStore = GlobalStore();
// Configure whether there is a space in the middle of the ELEMENT button text
const config = reactive({
	autoInsertSpace: false
});

// element Language configuration
const i18nLocale = computed((): any => {
	if (globalStore.language && globalStore.language == "zh") return zhCn;
	if (globalStore.language == "en") return en;
	return "";
});

// Configure global component size (small/default(medium)/large)
const assemblySize = computed((): string => globalStore.assemblySize);
</script>

<style scoped lang="scss"></style>
