<template>
	<div class="tree-box">
		<!-- Header Operation button -->
		<div class="tree-header">
			<div class="header-button-lf">
				<slot name="treeHeader" :row="selectedItem"></slot>
			</div>
			<div class="header-button-ri" v-if="toolButton">
				<el-button-group>
					<el-button :icon="Refresh" @click="refresh"> </el-button>
				</el-button-group>
			</div>
		</div>
		<el-input v-model="filterText" placeholder="Filter keyword" />
		<!-- Tabletop -->
		<div>
			<el-tree
				ref="treeRef"
				:data="treeData"
				:props="treeProps"
				@node-click="handleNodeClick"
				default-expand-all
				:expand-on-click-node="false"
				highlight-current
				:filter-node-method="filterNode"
			/>
		</div>
	</div>
</template>

<script setup lang="ts" name="component">
import { ref, watch, onMounted } from "vue";
import { Refresh, Operation, Search, Filter } from "@element-plus/icons-vue";

interface componentProps {
	requestApi: (params: any) => Promise<any>; // API ==> must be passed on the request form data
	dataCallback?: (data: any) => any; // The callback function of the data can be processed on the data
	initParam?: any; // Initialize request parameters ==> Non -Perminal (Faculty {})
	border?: boolean; // Whether the table display is displayed ==> Non -pass (default)
	toolButton?: boolean; // Whether the table function button is displayed ==> Non -pass (default TRUE)
	labelName?: string; // the name of the data
	childrenName?: string; // When the data exists in children, specify the children key name ==> Non -component (default "children")
}

// Accept the parent component parameter, configure the default value
const props = withDefaults(defineProps<componentProps>(), {
	pagination: true,
	initParam: {},
	border: true,
	toolButton: true,
	labelName: "name",
	childrenName: "children"
});

const emit = defineEmits<{
	(e: "handleNodeClick", node: any): void;
}>();

// Form DOM element
const treeRef = ref();

const selectedItem = ref();
const filterText = ref("");
const treeData = ref({});
const totalParam = ref({});

const treeProps = { label: props.labelName, children: props.childrenName };

// What needs to be done when initialization is to set the form query default value && obtain form data (the role of the RESET function is exactly these two functions)
onMounted(async () => {
	getTreeList();
});

/**
 * @description Get the table data
 * @return void
 * */
const getTreeList = async () => {
	try {
		// First put the initialization parameter and pagination parameter in the total parameter
		Object.assign(totalParam.value, props.initParam, {}); // isPageable ? pageParam.value : {}
		let { data } = await props.requestApi(totalParam.value);
		props.dataCallback && (data = props.dataCallback(data));
		treeData.value = data;
	} catch (error) {
		console.log(error);
	}
};

// The monitoring page Initparam is modified, and the table data is re -obtained
watch(
	() => props.initParam,
	() => getTreeList(),
	{ deep: true }
);

const refresh = () => {
	getTreeList();
	emit("handleNodeClick", { id: "" });
};

const handleNodeClick = (data: any) => {
	selectedItem.value = data;
	emit("handleNodeClick", data);
};

watch(filterText, val => {
	treeRef.value!.filter(val);
});
const filterNode = (value: string, data: any) => {
	if (!value) return true;
	return data[props.labelName].toLowerCase().includes(value.toLowerCase());
};

// Parameters and methods exposed to parent components
defineExpose({ selectedItem, refresh });
</script>
