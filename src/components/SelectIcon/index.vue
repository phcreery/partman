<template>
	<div class="icon-box">
		<el-input
			ref="inputRef"
			v-model="valueIcon"
			v-bind="$attrs"
			:placeholder="placeholder"
			:clearable="clearable"
			@clear="clearIcon"
			@focus="openDialog"
		>
			<template #append>
				<el-button :icon="customIcons[iconValue]" />
			</template>
		</el-input>
		<el-dialog v-model="dialogVisible" :title="placeholder" top="50px" width="66%">
			<el-input v-model="inputValue" placeholder="Search Icons" size="large" :prefix-icon="Icons.Search" />
			<el-scrollbar v-if="Object.keys(iconsList).length">
				<div class="icon-list">
					<div v-for="item in iconsList" :key="item" class="icon-item" @click="selectIcon(item)">
						<component :is="item"></component>
						<span>{{ item.name }}</span>
					</div>
				</div>
			</el-scrollbar>
			<el-empty description="The icon you are looking for was not searched~" v-else />
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="SelectIcon">
import { ref, computed } from "vue";
import * as Icons from "@element-plus/icons-vue";

interface SelectIconProps {
	iconValue: string;
	title?: string;
	clearable?: boolean;
	placeholder?: string;
}

const props = withDefaults(defineProps<SelectIconProps>(), {
	iconValue: "",
	title: "Please select icon",
	clearable: true,
	placeholder: "请Select icon"
});

// Receive it again，Prevent packing after clearable Report an error
const valueIcon = ref(props.iconValue);

const customIcons: { [key: string]: any } = Icons;

// Open dialog
const dialogVisible = ref(false);
const openDialog = (e: any) => {
	e.srcElement.blur();
	dialogVisible.value = true;
};

const emit = defineEmits(["update:iconValue"]);

// 选择图标(Trigger update of parent component data)
const selectIcon = (item: any) => {
	dialogVisible.value = false;
	valueIcon.value = item.name;
	emit("update:iconValue", item.name);
};

const clearIcon = () => {
	valueIcon.value = "";
	emit("update:iconValue", "");
};

// Listening for search box values
const inputValue = ref("");
const iconsList = computed((): { [key: string]: any } => {
	if (!inputValue.value) return Icons;
	let result: { [key: string]: any } = {};
	for (const key in customIcons) {
		if (key.toLowerCase().indexOf(inputValue.value.toLowerCase()) > -1) result[key] = customIcons[key];
	}
	return result;
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
