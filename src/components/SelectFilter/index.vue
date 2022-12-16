<template>
	<div class="select-filter">
		<div v-for="item in data" :key="item.key" class="select-filter-item">
			<div class="select-filter-item-title">
				<span>{{ item.title }} ：</span>
			</div>
			<span v-if="!item.options.length" class="select-filter-notData">No data available ~</span>
			<el-scrollbar>
				<ul class="select-filter-list">
					<li
						v-for="option in item.options"
						:key="option.value"
						:class="{
							active: selected[item.key] && selected[item.key].includes(option.value)
						}"
						@click="select(item, option)"
					>
						<el-icon v-if="option.icon"><component :is="option.icon" /></el-icon>
						<span>{{ option.label }}</span>
					</li>
				</ul>
			</el-scrollbar>
		</div>
	</div>
</template>

<script setup lang="ts" name="selectFilter">
import { ref, onBeforeMount } from "vue";
import { isType } from "@/utils/util";

interface optionsProps {
	value: string;
	label: string;
	icon?: string;
}

interface DataProps {
	title: string; // List Title
	key: string; // Current filter items key Value
	multiple?: boolean; // Whether it is multiple choice
	options: optionsProps[]; // Filter Data
}

interface FilterProps {
	data?: DataProps[]; // Selected list data
	defaultValues?: any; // Default Value
}
const props = withDefaults(defineProps<FilterProps>(), {
	data: () => []
});

// Selected values
type selectedProp = { [key: string]: string[] };
const selected = ref<selectedProp>({});

onBeforeMount(() => {
	props.data.forEach(item => {
		let transform = { ...props.defaultValues };
		// If the default selected value string，Convert to an array for highlighting
		if (transform[item.key] && isType(transform[item.key]) == "string") transform[item.key] = [...props.defaultValues[item.key]];
		// If there is a default value，Just set the default value，Check the first one if there is no default value（All）
		selected.value[item.key] = transform[item.key] || [item.options[0]?.value];
	});
});

/**
 * @description Select filter item
 * @param {Object} item Which of the selected list
 * @param {Object} option Selected values
 * @return void
 * */
const select = (item: DataProps, option: optionsProps) => {
	if (!item.multiple) {
		// Single choice
		if (selected.value[item.key].includes(option.value)) return;
		selected.value[item.key] = [option.value];
	} else {
		// If the first value is selected，then directly set
		if (item.options[0].value === option.value) selected.value[item.key] = [option.value];
		// If the selected value is already selected，then delete the selected value
		if (selected.value[item.key].includes(option.value)) {
			// Find the index of the currently clicked element
			let currentIndex = selected.value[item.key].findIndex(s => s === option.value);
			selected.value[item.key].splice(currentIndex, 1);
			// When all of them are deleted，Check the first value
			if (selected.value[item.key].length == 0) selected.value[item.key] = [item.options[0].value];
		} else {
			// When the click value is not selected，Adding selected values
			selected.value[item.key].push(option.value);
			// Single check all and click on the unchecked value，Delete the first value
			if (selected.value[item.key].includes(item.options[0].value)) {
				selected.value[item.key].splice(0, 1);
			}
		}
	}
	change();
};

// Trigger parent component
interface FilterEmits {
	(e: "change", value: selectedProp): void;
}
const emit = defineEmits<FilterEmits>();
const change = () => {
	let params: { [key: string]: any } = { ...selected.value };
	props.data.forEach(item => !item.multiple && (params[item.key] = params[item.key].join("")));
	emit("change", params);
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
