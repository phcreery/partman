<template>
	<el-row :gutter="20" style="height: 100%">
		<el-col :span="6">
			<ProTree ref="proTree" :requestApi="getFootprintCategoryEnumTree" :initParam="initParam" :dataCallback="dataCallbackTree">
				<template #treeHeader="scope">
					<el-button type="primary" :icon="CirclePlus" @click="openDrawer('New')" v-if="BUTTONS.add"></el-button>
					<el-button
						type="danger"
						:icon="Delete"
						plain
						:disabled="!scope.isSelected"
						@click="batchDelete(scope.ids)"
						v-if="BUTTONS.delete"
					>
					</el-button>
				</template>
			</ProTree>
		</el-col>
		<el-col :span="18">
			<div class="table-box">
				<ProTable
					ref="proTable"
					:columns="columns"
					:requestApi="getFootprintList"
					:initParam="initParam"
					:isPageable="true"
					:dataCallback="dataCallbackTable"
				>
					<!-- Table header button -->
					<template #tableHeader="scope">
						<el-button type="primary" :icon="CirclePlus" @click="openDrawer('New')" v-if="BUTTONS.add">New Footprint</el-button>
						<el-button
							type="danger"
							:icon="Delete"
							plain
							:disabled="!scope.isSelected"
							@click="batchDelete(scope.ids)"
							v-if="BUTTONS.delete"
						>
							Delete
						</el-button>
					</template>
					<!-- Expand -->
					<template #expand="scope">
						{{ scope.row }}
					</template>
					<!-- Table operation -->
					<template #action="scope">
						<el-button type="primary" link :icon="EditPen" @click="openDrawer('Edit', scope.row)">Edit</el-button>
					</template>
				</ProTable>
				<FootprintDrawer ref="drawerRef"></FootprintDrawer>
			</div>
		</el-col>
	</el-row>
</template>

<script setup lang="tsx" name="useComponent">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { ColumnProps } from "@/components/ProTable/interface/index";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import ProTree from "@/components/ProTree/index.vue";
import FootprintDrawer from "@/views/footprints/components/FootprintDrawer.vue";
import { CirclePlus, Delete, EditPen, Download, Upload, View, Refresh, DCaret } from "@element-plus/icons-vue";
import { ResList, Component, Footprint } from "@/api/interface";
import {
	getComponentList,
	postComponentCreate,
	patchComponentUpdate,
	deleteComponents,
	getFootprintsEnum,
	getComponentStorageLocationEnum,
	getComponentCategoryEnum,
	getComponentCategoryEnumTree,
	getFootprintList,
	getFootprintCategoryEnumTree
} from "@/api/modules/components";

// Get the ProTable element and call it to get the refresh data method (you can also get the current query parameter, so that it is convenient for exporting and carrying parameters)
const proTable = ref();

// If the table needs to initialize the request parameter, it will be directly defined to the propable (each request will automatically bring the parameter every time, and it will always be brought to
const initParam = reactive({
	expand: ""
});

// DataCallBack is processed to the returned table data. If the data returned in the background is not DataList && Total && PAGENUM && PageSize, then you can process these fields here.
const dataCallbackTree = (data: ResList<Footprint.ResGetFootprintRecord>) => {
	console.log("data callback", data);
	// return {
	// 	datalist: data.items,
	// 	total: data.totalItems,
	// 	pageNum: data.page,
	// 	pageSize: data.perPage
	// };
	return data;
};
const dataCallbackTable = (data: ResList<Footprint.ResGetFootprintRecord>) => {
	console.log("data callback", data);
	return {
		datalist: data.items,
		total: data.totalItems,
		pageNum: data.page,
		pageSize: data.perPage
	};
};
// Page button permission
const { BUTTONS } = useAuthButtons();

// Table configuration item
const columns: Partial<ColumnProps>[] = [
	{ type: "selection", width: 40, fixed: "left" },
	// { type: "expand", label: "" },
	// {
	// 	prop: "category",
	// 	label: "Category",
	// 	align: "left",
	// 	// values that go into the treeSelect props
	// 	searchProps: {
	// 		value: "id",
	// 		label: "_fullName",
	// 		props: { value: "id", label: "name", emitPath: false },
	// 		checkStrictly: true
	// 	},
	// 	sortable: true,
	// 	search: true,
	// 	searchType: "treeSelect",
	// 	enumFunction: getComponentCategoryEnum,
	// 	enumTreeFunction: getComponentCategoryEnumTree
	// },
	{
		prop: "name",
		label: "Name",
		width: 130,
		sortable: true,
		search: true,
		searchType: "text"
		// searchProps: { disabled: true }
		// renderHeader
	},
	{
		prop: "description",
		label: "Description",
		// width: 220,
		search: true,
		searchType: "text"
	},
	{
		prop: "action",
		label: "Action",
		width: 100,
		fixed: "right"
	}
];

// Delete user information
const deleteComponent = async (params: Component.ResGetComponentRecord) => {
	await useHandleData(deleteComponents, { ids: [params.id] }, `Delete [${params.name}] component`);
	proTable.value.refresh();
};
// Batch delete components
const batchDelete = async (ids: string[]) => {
	await useHandleData(deleteComponents, { ids }, "Delete the selected component(s)");
	proTable.value.refresh();
};

// Open the drawer (new, view, edit)
interface DrawerExpose {
	acceptParams: (params: any) => void;
}
const drawerRef = ref<DrawerExpose>();
const openDrawer = (title: string, rowData: Partial<Component.ResGetComponentRecord> = {}) => {
	let params = {
		title,
		rowData: { ...rowData },
		isView: title === "View",
		apiUrl:
			title === "New"
				? postComponentCreate
				: title === "Edit"
				? patchComponentUpdate
				: title === "Stock"
				? patchComponentUpdate
				: "",
		updateTable: proTable.value.refresh
	};
	drawerRef.value!.acceptParams(params);
};

interface Tree {
	label: string;
	children?: Tree[];
}

const handleNodeClick = (data: Tree) => {
	console.log(data);
};

const data: Tree[] = [
	{
		label: "Level one 1",
		children: [
			{
				label: "Level two 1-1",
				children: [
					{
						label: "Level three 1-1-1"
					}
				]
			}
		]
	},
	{
		label: "Level one 2",
		children: [
			{
				label: "Level two 2-1",
				children: [
					{
						label: "Level three 2-1-1"
					}
				]
			},
			{
				label: "Level two 2-2",
				children: [
					{
						label: "Level three 2-2-1"
					}
				]
			}
		]
	},
	{
		label: "Level one 3",
		children: [
			{
				label: "Level two 3-1",
				children: [
					{
						label: "Level three 3-1-1"
					}
				]
			},
			{
				label: "Level two 3-2",
				children: [
					{
						label: "Level three 3-2-1"
					}
				]
			}
		]
	}
];
</script>
