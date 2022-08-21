<!-- 📚📚📚 Pro-Table Documentation: https://juejin.cn/post/7094890833064755208 -->
<!-- 💢💢💢 In the later period, the Pro-Table component will be reconstructed. -->

<template>
	<div class="table-box">
		<!-- Header Operation button -->
		<div class="table-header">
			<div class="header-button-lf">
				<slot name="treeHeader" :ids="selectedListIds" :isSelected="isSelected"></slot>
			</div>
			<div class="header-button-ri" v-if="toolButton">
				<el-button-group>
					<el-button :icon="Refresh" @click="refresh"> </el-button>
				</el-button-group>
			</div>
		</div>
		<!-- Tabletop -->
		<div>
			<el-tree :data="data" @node-click="handleNodeClick" />
		</div>
	</div>
</template>

<script setup lang="ts" name="component">
import { ref, watch } from "vue";
import { useTable } from "@/hooks/useTable";
import { useSelection } from "@/hooks/useSelection";
import { Refresh, Operation, Search, Filter } from "@element-plus/icons-vue";
import { ColumnProps } from "@/components/ProTable/interface";

// Form DOM element
const tableRef = ref();

// Whether to display the search module
const isShowSearch = ref<boolean>(false);

interface componentProps {
	columns: Partial<ColumnProps>[]; // Column configuration item
	requestApi: (params: any) => Promise<any>; // API ==> must be passed on the request form data
	dataCallback?: (data: any) => any; // The callback function of the data can be processed on the data
	// pagination?: boolean; // Do you need a paging component ==> Non -pass (default)
	initParam?: any; // Initialize request parameters ==> Non -Perminal (Faculty {})
	border?: boolean; // Whether the table display is displayed ==> Non -pass (default)
	// stripe?: boolean; // Whether to bring zebra pattern table ==> Non -component (default False)
	toolButton?: boolean; // Whether the table function button is displayed ==> Non -pass (default TRUE)
	childrenName?: string; // When the data exists in children, specify the children key name ==> Non -component (default "children")
}

// Accept the parent component parameter, configure the default value
const props = withDefaults(defineProps<componentProps>(), {
	columns: () => [],
	pagination: true,
	initParam: {},
	border: true,
	// stripe: false,
	toolButton: true,
	childrenName: "children"
});

// The monitoring page Initparam is modified, and the table data is re -obtained
watch(
	() => props.initParam,
	() => {
		getTableList();
	},
	{ deep: true }
);

// If the current enum needs to request data in the background data, call the request interface to get the enum data
// tableColumns.value.forEach(async item => {
// 	if (item.enumFunction && typeof item.enumFunction === "function") {
// 		const { data } = await item.enumFunction();
// 		item.enum = data;
// 	}
// 	if (item.enumTreeFunction && typeof item.enumTreeFunction === "function") {
// 		const { data } = await item.enumTreeFunction();
// 		item.enumTree = data;
// 	}
// });

const refresh = () => {
	tableRef.value!.clearSelection();
	getTableList();
};

// Parameters and methods exposed to parent components
defineExpose({ refresh });
</script>
