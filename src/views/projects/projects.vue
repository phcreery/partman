<template>
	<div class="table-box">
		<el-row :gutter="20">
			<el-col :span="6">
				<ProTree
					ref="proTree"
					:requestApi="getProjectsEnum"
					:initParam="initParamProject"
					:dataCallback="dataCallbackTree"
					@handle-node-click="handleProjectSelect"
					:showAll="false"
				>
					<template #treeHeader="scope">
						<el-button type="primary" :icon="CirclePlus" @click="openProjectDrawer('New')" v-if="BUTTONS.add"></el-button>
						<el-button
							:icon="EditPen"
							:disabled="scope.row.id === ''"
							@click="openProjectDrawer('Edit', scope.row)"
							v-if="BUTTONS.edit"
						></el-button>
						<el-button
							type="danger"
							:icon="Delete"
							plain
							:disabled="scope.row.id === ''"
							@click="batchDeleteProject([scope.row.id])"
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
						:requestApi="getProjectComponentsList"
						:initParam="initParam"
						:isPageable="true"
						:dataCallback="dataCallbackTable"
					>
						<!-- Table header button -->
						<template #tableHeader="scope">
							<el-button type="primary" :icon="CirclePlus" @click="openComponentDrawer('New')" v-if="BUTTONS.add">
								Add Component
							</el-button>
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
							<el-button type="primary" :icon="Upload" plain @click="batchAdd" v-if="BUTTONS.batchAdd">Import BOM</el-button>
							<el-button type="primary" :icon="Download" plain @click="downloadFile" v-if="BUTTONS.export">Export</el-button>
						</template>
						<!-- Expand -->
						<template #expand="scope">
							{{ scope.row }}
						</template>
						<!-- Table operation -->
						<template #action="scope">
							<el-button type="primary" link :icon="EditPen" @click="openComponentDrawer('Edit', scope.row)">Edit</el-button>
						</template>
					</ProTable>
					<ProjectComponentDrawer ref="drawerRefComponent"></ProjectComponentDrawer>
					<ProjectDrawer ref="drawerRefProject"></ProjectDrawer>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="tsx" name="useComponent">
import { ref, reactive } from "vue";
import { ColumnProps } from "@/components/ProTable/interface/index";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { JSON2CSV } from "@/hooks/useDataTransform";
import ProTable from "@/components/ProTable/index.vue";
import ProTree from "@/components/ProTree/index.vue";
import ComponentDrawer from "@/views/inventory/components/ComponentDrawer.vue";
import ProjectComponentDrawer from "@/views/projects/components/ProjectComponentDrawer.vue";
import ProjectDrawer from "@/views/projects/components/ProjectDrawer.vue";
import { CirclePlus, Delete, EditPen, Upload, Download } from "@element-plus/icons-vue";
import { ResList, Component, Project, ProjectComponents } from "@/api/interface";
import {
	postComponentCreate,
	patchComponentUpdate,
	deleteComponents,
	getProjectsEnum,
	// getProjectEnumTree,
	getProjectComponentsList,
	postProjectComponentAdd,
	postProjectComponentUpdate,
	deleteProjectComponents,
	postProjectCreate,
	patchProjectUpdate,
	deleteComponentCategories,
	deleteProjects
} from "@/api/modules/components";

// Get the ProTable element and call it to get the refresh data method (you can also get the current query parameter, so that it is convenient for exporting and carrying parameters)
const proTable = ref();
const proTree = ref();

// If the table needs to initialize the request parameter, it will be directly defined to the prop table (each request will automatically bring the parameter every time, and it will always be brought to
const initParam = reactive<Partial<Project.ReqGetProjectComponentListParams>>({
	expand: "components",
	projectID: ""
	// filter: { name: undefined, category: undefined, description: undefined }
});

const initParamProject = reactive({});
const projectData = ref();
// const projectComponents = ref([]);

// DataCallBack is processed to the returned table data. If the data returned in the background is not DataList && Total && PAGENUM && PageSize, then you can process these fields here.
const dataCallbackTree = (data: any) => {
	projectData.value = data;
	return data;
};
const dataCallbackTable = (data: ResList<Project.ReqGetProjectComponentListParams>) => {
	return {
		datalist: data.items,
		total: data.totalItems,
		pageNum: data.page,
		pageSize: data.perPage
	};
};

// what binds the category tree to the table filter
const handleProjectSelect = (data: any) => {
	initParam.projectID = data.id;
};

// Page button permission
const { BUTTONS } = useAuthButtons();

// Table configuration item
const columns: Partial<ColumnProps>[] = [
	{ type: "selection", width: 40, fixed: "left" },
	// { type: "expand", label: "" },
	{
		prop: "mpn",
		label: "MPN",
		width: 130,
		sortable: true,
		search: true,
		searchType: "text"
	},
	{
		prop: "description",
		label: "Description",
		// width: 220,
		search: true,
		searchType: "text"
	},
	{
		prop: "_quantity_used",
		label: "Qty.",
		width: 80
		// search: true,
	},
	{
		prop: "action",
		label: "Action",
		width: 100,
		fixed: "right"
	}
];

// Batch delete footprints
const batchDelete = async (ids: string[]) => {
	await useHandleData(
		deleteProjectComponents,
		{ projectID: String(initParam.projectID), ids },
		"Remove the selected components(s) from project"
	);
	proTable.value.refresh();
};

// Batch delete footprints
const batchDeleteProject = async (ids: string[]) => {
	await useHandleData(deleteProjects, { ids }, "Delete the selected projects(s)");
	proTree.value.refresh();
};

// Export component list
const downloadFile = async () => {
	// useDownload(exportUserInfo, "user list", proTable.value.searchParam);
	let res = await getProjectComponentsList({
		page: 1,
		perPage: 500,
		filter: proTable.value.searchParam,
		expand: "",
		sort: "",
		projectID: initParam.projectID ?? ""
	});
	let json = res.data.items;
	console.log(json);
	let JSON = JSON2CSV(json, ["mpn", "_quantity_used"]); // TODO: use visible columns
	useDownload(() => JSON, "partman_component_list", {}, true, ".csv");
};

// Open the drawer (new, view, edit)
interface DrawerExpose {
	acceptParams: (params: any) => void;
}
const drawerRefComponent = ref<DrawerExpose>();
const openComponentDrawer = (title: string, rowData: Partial<ProjectComponents.ResGetProjectComponentRecord> = {}) => {
	let params = {
		title,
		rowData: { _of_project_id: initParam.projectID, id: rowData.id, _quantity_used: rowData._quantity_used }, // { ...rowData },
		isView: title === "View",
		apiUrl: title === "New" ? postProjectComponentAdd : title === "Edit" ? postProjectComponentUpdate : "",
		updateTable: proTable.value.refresh
	};
	drawerRefComponent.value!.acceptParams(params);
};

const drawerRefProject = ref<DrawerExpose>();
const openProjectDrawer = (title: string, rowData: Partial<Project.ResGetProjectRecord> = {}) => {
	let params = {
		title,
		rowData: { ...rowData },
		isView: title === "View",
		apiUrl: title === "New" ? postProjectCreate : title === "Edit" ? patchProjectUpdate : "",
		updateTable: proTree.value.refresh
	};
	drawerRefProject.value!.acceptParams(params);
};
</script>
