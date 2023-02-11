<template>
  <div class="main-box">
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
    <!-- <TreeFilter title="Projects" multiple label="name" :requestApi="getProjectsEnum" @change="handleProjectSelect" /> -->
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
            @click="batchDelete(scope.selectedListIds)"
            v-if="BUTTONS.delete"
          >
            Delete
          </el-button>
          <el-button :icon="Upload" plain @click="batchAdd" v-if="BUTTONS.batchAdd">Import BOM</el-button>
          <el-button :icon="Download" plain @click="downloadFile" v-if="BUTTONS.export">Export</el-button>
        </template>
        <!-- Expand -->
        <template #expand="scope">
          {{ scope.row }}
        </template>
        <!-- Table operation -->
        <template #operation="scope">
          <el-button type="primary" link :icon="EditPen" @click="openComponentDrawer('Edit', scope.row)">Edit</el-button>
        </template>
      </ProTable>
    </div>
    <ProjectDrawer ref="drawerRefProject"></ProjectDrawer>
    <ProjectComponentDrawer ref="drawerRefComponent"></ProjectComponentDrawer>
    <ImportExcel ref="dialogRefImport"></ImportExcel>
  </div>
</template>

<script setup lang="tsx" name="useComponent">
import { ref, reactive } from "vue";
import { ElNotification } from "element-plus";
import { ColumnProps } from "@/components/ProTable/interface/index";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { JSON2CSV } from "@/hooks/useDataTransform";
import ProTable from "@/components/ProTable/index.vue";
import ProTree from "@/components/ProTree/index.vue";
// import TreeFilter from "@/components/TreeFilter/index.vue";
// import ImportExcel from "@/components/ImportExcel/index.vue";
import ImportExcel from "../inventory/components/ImportExcel.vue";
import ProjectComponentDrawer from "@/views/projects/components/ProjectComponentDrawer.vue";
import ProjectDrawer from "@/views/projects/components/ProjectDrawer.vue";
import { CirclePlus, Delete, EditPen, Upload, Download } from "@element-plus/icons-vue";
import { ResList, Project, ProjectComponents } from "@/api/interface";
import {
  getComponentEnum,
  postComponentCreate,
  getProjectsEnum,
  getProjectComponentsList,
  getProjectComponentsListForExport,
  postProjectComponentAdd,
  patchProjectComponentUpdate,
  deleteProjectComponents,
  postProjectCreate,
  patchProjectUpdate,
  deleteProjects
} from "@/api/modules/components";

// Get the ProTable element and call it to get the refresh data method (you can also get the current query parameter, so that it is convenient for exporting and carrying parameters)
const proTable = ref();
const proTree = ref();

// If the table needs to initialize the request parameter, it will be directly defined to the prop table (each request will automatically bring the parameter every time, and it will always be brought to
const initParam = reactive<Partial<ProjectComponents.ReqGetProjectComponentListParams>>({
  projectID: ""
});

const initParamProject = reactive({});
const projectData = ref();

// DataCallBack is processed to the returned table data. If the data returned in the background is not DataList && Total && PAGENUM && PageSize, then you can process these fields here.
const dataCallbackTree = (data: any) => {
  projectData.value = data;
  return data;
};
const dataCallbackTable = (data: ResList<ProjectComponents.ReqGetProjectComponentListParams>) => {
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
const columns: ColumnProps[] = [
  { type: "selection", width: 40, fixed: "left" },
  // { type: "expand", label: "" },
  {
    prop: "bom_id",
    label: "ID",
    width: 80,
    sortable: true,
    search: { el: "input" }
  },
  {
    prop: "component",
    label: "MPN",
    width: 120,
    align: "left",
    enum: getComponentEnum,
    fieldNames: { value: "id", label: "mpn" },
    sortable: true,
    search: {
      el: "select",
      props: {
        value: "id",
        label: "mpn",
        multiple: true,
        filterable: true
      }
    }
  },
  {
    prop: "quantity",
    label: "Qty.",
    width: 80,
    sortable: true
  },
  {
    prop: "refdesignators",
    label: "Ref. Designators",
    width: 80,
    align: "left",
    search: { el: "input" }
  },
  {
    prop: "comment",
    label: "Comment",
    align: "left",
    search: { el: "input" }
  },
  {
    prop: "operation",
    label: "Operation",
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
  proTable.value.getTableList();
};

// Batch delete footprints
const batchDeleteProject = async (ids: string[]) => {
  await useHandleData(deleteProjects, { ids }, "Delete the selected projects(s)");
  proTree.value.getTableList();
};

// Export component list
const downloadFile = async () => {
  // useDownload(exportUserInfo, "user list", proTable.value.searchParam);
  let name = initParam.projectID;
  let json = await getProjectComponentsListForExport({
    filter: proTable.value.searchParam,
    projectID: initParam.projectID ?? ""
  });
  let columns = proTable.value.tableColumns.map((c: Partial<ColumnProps>) => c.prop ?? "");
  let csv = JSON2CSV(json, columns);
  useDownload(() => csv, `${name}_project_component_list`, {}, true, ".csv");
};

// Add users in batches
interface DialogExpose {
  acceptParams: (params: any) => void;
}
const dialogRefImport = ref<DialogExpose>();
// const batchAdd = () => {
//   let params = {
//     title: "component",
//     // tempApi: exportUserInfo,
//     // importApi: BatchAddUser,
//     getTableList: proTable.value.getTableList
//   };
//   dialogRef.value!.acceptParams(params);
// };
const batchAdd = async () => {
  if (!initParam.projectID) {
    ElNotification({
      title: "Notification",
      message: "Please select a project first",
      type: "error"
    });
    return;
  }
  let templateColumns = [
    { prop: "bom_id", label: "BOM ID", mergeOptions: { single: true, required: true } },
    { prop: "component", label: "MPN", apiCreate: postComponentCreate, uniqueKey: "mpn", mergeOptions: { single: true } },
    { prop: "quantity", label: "Quantity", mergeOptions: { required: true, defaultBoth: true } },
    { prop: "refdesignators", label: "Ref. Designators", mergeOptions: { defaultBoth: true } },
    { prop: "comment", label: "Comment", mergeOptions: { defaultBoth: true } }
  ];
  console.log(templateColumns);
  console.log(proTable.value.enumMap);
  let params = {
    title: "Project Components",
    columns: templateColumns,
    uniqueKey: "bom_id",
    enumMap: proTable.value.enumMap,
    apiGetExistingEntries: async () => await getProjectComponentsListForExport({ filter: {}, projectID: initParam.projectID! }), // existingEntries,
    apiCreate: (params: ProjectComponents.ReqAddProjectComponentParams) =>
      postProjectComponentAdd({ ...params, _ofProjectID: initParam.projectID! }),
    apiUpdate: (params: ProjectComponents.ReqUpdateProjectComponentParams) =>
      patchProjectComponentUpdate({ ...params, _ofProjectID: initParam.projectID! }),
    refresh: proTable.value.getTableList
  };
  dialogRefImport.value!.acceptParams(params);
};

// Open the drawer (new, view, edit)
interface DrawerExpose {
  acceptParams: (params: any) => void;
}
const drawerRefComponent = ref<DrawerExpose>();
const openComponentDrawer = (title: string, rowData: Partial<ProjectComponents.ResGetProjectComponentRecord> = {}) => {
  let params = {
    title,
    rowData: { ...rowData, _ofProjectID: initParam.projectID },
    isView: title === "View",
    apiUrl: title === "New" ? postProjectComponentAdd : title === "Edit" ? patchProjectComponentUpdate : "",
    updateTable: proTable.value.getTableList
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
    updateTable: proTree.value.getTableList
  };
  drawerRefProject.value!.acceptParams(params);
};
</script>
