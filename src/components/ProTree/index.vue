<!-- 📚📚📚 Pro-Table Documentation: https://juejin.cn/post/7094890833064755208 -->
<!-- 💢💢💢 In the later period, the Pro-Table component will be reconstructed. -->

<template>
	<div class="table-box">
		<!-- Header Operation button -->
		<div class="table-header">
			<div class="header-button-lf">
				<slot name="treeHeader" :row="selectedFootprint"></slot>
			</div>
			<div class="header-button-ri" v-if="toolButton">
				<el-button-group>
					<el-button :icon="Refresh" @click="refresh"> </el-button>
				</el-button-group>
			</div>
		</div>
		<!-- Tabletop -->
		<div>
			<el-tree
				ref="treeRef"
				:data="treeData"
				:props="{ label: 'name', children: 'children' }"
				@node-click="handleNodeClick"
				default-expand-all
				highlight-current
			/>
		</div>
	</div>
</template>

<script setup lang="ts" name="component">
import { ref, watch, toRefs, reactive, onMounted } from "vue";
import { useTable } from "@/hooks/useTable";
import { useSelection } from "@/hooks/useSelection";
import { Refresh, Operation, Search, Filter } from "@element-plus/icons-vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { AnyKindOfDictionary } from "lodash";

// Form DOM element
const treeRef = ref();

// Whether to display the search module
const isShowSearch = ref<boolean>(false);

interface componentProps {
	requestApi: (params: any) => Promise<any>; // API ==> must be passed on the request form data
	dataCallback?: (data: any) => any; // The callback function of the data can be processed on the data
	initParam?: any; // Initialize request parameters ==> Non -Perminal (Faculty {})
	border?: boolean; // Whether the table display is displayed ==> Non -pass (default)
	toolButton?: boolean; // Whether the table function button is displayed ==> Non -pass (default TRUE)
	// childrenName?: string; // When the data exists in children, specify the children key name ==> Non -component (default "children")
}

// Accept the parent component parameter, configure the default value
const props = withDefaults(defineProps<componentProps>(), {
	pagination: true,
	initParam: {},
	border: true,
	toolButton: true
	// childrenName: "children"
});

const emit = defineEmits<{
	(e: "handleNodeClick", node: any): void;
}>();

const useTree = (api: (params: any) => Promise<any>, initParam: object = {}, dataCallBack?: (data: any) => any) => {
	const state = reactive({
		// Table data
		treeData: [],
		// Query parameters (including only query)
		searchParam: {},
		// Initialize the default query parameter
		searchInitParam: {},
		// Total parameters (including pagination and query parameters)
		totalParam: {}
	});

	// What needs to be done when initialization is to set the form query default value && obtain form data (the role of the RESET function is exactly these two functions)
	onMounted(async () => {
		reset();
	});

	/**
	 * @description Get the table data
	 * @return void
	 * */
	const getTreeList = async () => {
		try {
			// First put the initialization parameter and pagination parameter in the total parameter
			Object.assign(state.totalParam, initParam, {}); // isPageable ? pageParam.value : {}
			let { data } = await api(state.totalParam);
			dataCallBack && (data = dataCallBack(data));
			state.treeData = data;
			// Practical pagination data returned in the background (if there is a pagination update pagination information)
			// const { pageNum, pageSize, total } = data;
			// isPageable && updatePageable({ pageNum, pageSize, total });
			console.log("useTree data", data);
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * @description Update query parameters
	 * @return void
	 * */
	const updatedTotalParam = () => {
		state.totalParam = {};
		// Process query parameters, you can add a custom prefix operation to the query parameter
		let nowSearchParam: { [propName: string]: any } = {};
		// Prevent the parameter of the manual clearance input box (here you can customize query parameters prefix)
		for (let key in state.searchParam) {
			// * In some cases, parameters are false/0 You should also carry parameters
			if (state.searchParam[key] || state.searchParam[key] === false || state.searchParam[key] === 0) {
				nowSearchParam[key] = state.searchParam[key];
			}
		}
		Object.assign(state.totalParam, { filter: nowSearchParam }, {}); // isPageable ? pageParam.value : {}
	};

	/**
	 * @description Form data query
	 * @return void
	 * */
	const search = () => {
		// state.pageable.pageNum = 1;
		updatedTotalParam();
		getTreeList();
	};

	/**
	 * @description Tree data reset
	 * @return void
	 * */
	const reset = () => {
		state.searchParam = {};
		// When resetting the search form, if there is a default search parameter, reset the default search parameter
		Object.keys(state.searchInitParam).forEach(key => {
			state.searchParam[key] = state.searchInitParam[key];
		});
		updatedTotalParam();
		getTreeList();
	};

	return {
		...toRefs(state),
		getTreeList,
		search,
		reset
	};
};

const { treeData, getTreeList, search, reset } = useTree(props.requestApi, props.initParam, props.dataCallback);

// The monitoring page Initparam is modified, and the table data is re -obtained
watch(
	() => props.initParam,
	() => {
		getTreeList();
	},
	{ deep: true }
);

const refresh = () => {
	// treeRef.value!.clearSelection();
	getTreeList();
};

const selectedFootprint = ref();

const handleNodeClick = (data: any) => {
	// console.log(data);
	selectedFootprint.value = data;
	emit("handleNodeClick", data);
};

// Parameters and methods exposed to parent components
defineExpose({ selectedFootprint, refresh });
</script>
