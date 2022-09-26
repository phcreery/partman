<template>
	<div class="table-box">
		<ProTable
			ref="proTable"
			:columns="columns"
			:requestApi="getProjectList"
			:initParam="initParam"
			:isPageable="true"
			:dataCallback="dataCallback"
		>
			<!-- Table header button -->
			<template #tableHeader="scope">
				<el-button type="primary" :icon="CirclePlus" @click="openDrawer('New')" v-if="BUTTONS.add">New Project</el-button>
				<el-button
					type="danger"
					:icon="Delete"
					plain
					:disabled="!scope.isSelected"
					@click="batchDelete(scope.ids)"
					v-if="BUTTONS.batchDelete"
				>
					Delete
				</el-button>
			</template>
			<!-- Expand -->
			<template #expand="scope">
				<!-- {{ scope.row }} -->
				<ProjectDescription ref="descriptions" :components="scope.row['@expand'].components" />
			</template>
			<template #stock="scope">
				{{ scope.row.stock }}
				<el-button type="primary" link :icon="DCaret" @click="openDrawer('Stock', scope.row)"></el-button>
			</template>

			<!-- Table operation -->
			<template #action="scope">
				<el-button type="primary" link :icon="EditPen" @click="openDrawer('Edit', scope.row)">Edit</el-button>
			</template>
		</ProTable>
		<ProjectDrawer ref="drawerRef"></ProjectDrawer>
		<ImportExcel ref="dialogRef"></ImportExcel>
	</div>
</template>

<script setup lang="tsx" name="useProject">
import { ref, reactive } from "vue";
import { ResList, Project } from "@/api/interface";
import { ColumnProps } from "@/components/ProTable/interface/index";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import ProjectDrawer from "@/views/projects/components/ProjectDrawer.vue";
import { CirclePlus, Delete, EditPen, DCaret } from "@element-plus/icons-vue";
import {
	getProjectList,
	postProjectCreate,
	patchProjectUpdate,
	deleteProjects
	// getFootprintsEnum
} from "@/api/modules/components";

import ProjectDescription from "@/views/projects/components/ProjectDescription.vue";

// Get the ProTable element and call it to get the refresh data method (you can also get the current query parameter, so that it is convenient for exporting and carrying parameters)
const proTable = ref();
// If the table needs to initialize the request parameter, it will be directly defined to the protable (each request will automatically bring the parameter every time, and it will always be brought to
const initParam = reactive({
	expand: "components"
});

// DataCallBack is processed to the returned table data. If the data returned in the background is not DataList && Total && PAGENUM && PageSize, then you can process these fields here.
const dataCallback = (data: ResList<Project.ResGetProjectRecord>) => {
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
	{ type: "expand", label: "" },
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
	// 	// searchInitParam: {category}
	// 	sortable: true,
	// 	search: true,
	// 	// searchType: "select",
	// 	searchType: "treeSelect",
	// 	// renderText: (data: Project.ResGetProjectRecord) => data["@expand"].category.name,
	// 	enumFunction: getProjectCategoryEnum,
	// 	enumTreeFunction: getProjectCategoryEnumTree
	// },
	{
		prop: "name",
		label: "Name",
		width: 130,
		sortable: true,
		search: true,
		searchType: "text"
		// searchProps: { disabled: true }
	},
	{
		prop: "description",
		label: "Description",
		// width: 220,
		search: true,
		searchType: "text"
	},
	// {
	// 	prop: "components",
	// 	label: "Components",
	// 	// width: 220,
	// 	search: true,
	// 	searchType: "text"
	// },
	{
		prop: "action",
		label: "Action",
		width: 100,
		fixed: "right"
	}
];

// Delete user information
// const deleteProject = async (params: Project.ResGetProjectRecord) => {
// 	await useHandleData(deleteProjects, { ids: [params.id] }, `Delete [${params.name}] component`);
// 	proTable.value.refresh();
// };
// Batch delete components
const batchDelete = async (ids: string[]) => {
	await useHandleData(deleteProjects, { ids }, "Delete the selected component(s)");
	proTable.value.refresh();
};

// Add users in batches
interface DialogExpose {
	acceptParams: (params: any) => void;
}
const dialogRef = ref<DialogExpose>();

// Open the drawer (new, view, edit)
interface DrawerExpose {
	acceptParams: (params: any) => void;
}
const drawerRef = ref<DrawerExpose>();
const openDrawer = (title: string, rowData: Partial<Project.ResGetProjectRecord> = {}) => {
	let params = {
		title,
		rowData: { ...rowData },
		isView: title === "View",
		apiUrl:
			title === "New" ? postProjectCreate : title === "Edit" ? patchProjectUpdate : title === "Stock" ? patchProjectUpdate : "",
		updateTable: proTable.value.refresh
	};
	drawerRef.value!.acceptParams(params);
};
</script>
