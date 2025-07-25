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
          @click="openProjectDrawer('Edit', scope.row as unknown as Project.ResGetProjectRecord)"
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
        pageAuthId="projects"
        :columns="columns"
        :requestApi="getProjectComponentsList"
        :initParam="initParam"
        :isPageable="true"
        :dataCallback="dataCallbackTable"
        :requestError="requestError"
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
          <ComponentDetails
            :title="scope.row.expand.component.mpn ?? ''"
            :isView="true"
            :rowData="scope.row.expand.component"
          ></ComponentDetails>
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

<script setup lang="tsx" name="projects">
import { ref, reactive } from "vue";
import { ElNotification } from "element-plus";
import { CirclePlus, Delete, EditPen, Upload, Download } from "@element-plus/icons-vue";

// Components
import { ColumnProps, PageableList } from "@/components/ProTable/interface/index";
import ProTable from "@/components/ProTable/index.vue";
import ProTree from "@/components/ProTree/index.vue";
import ImportExcel from "../inventory/components/ImportExcel.vue";
import ComponentDetails from "@/views/inventory/components/ComponentDetails.vue";
import ProjectComponentDrawer from "@/views/projects/components/ProjectComponentDrawer.vue";
import ProjectDrawer from "@/views/projects/components/ProjectDrawer.vue";

// Hooks
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { JSON2CSV } from "@/hooks/useDataTransform";

// API
import { ListResult, Project, ProjectComponents } from "@/api/interface";
import {
  getComponentEnum,
  getProjectsEnum,
  getProjectComponentsList,
  getProjectComponentsListForExport,
  postProjectComponentsUpload,
  postProjectComponentAdd,
  patchProjectComponentUpdate,
  deleteProjectComponents,
  postProjectCreate,
  patchProjectUpdate,
  deleteProjects
} from "@/api/modules/components";

// Get the ProTable element and call it to get the refresh data method (you can also get the current query parameter, so that it is convenient for exporting and carrying parameters)
const proTable = ref<InstanceType<typeof ProTable>>();
const proTree = ref<InstanceType<typeof ProTree>>();

// If the table needs to initialize the request parameter, it will be directly defined to the prop table (each request will automatically bring the parameter every time, and it will always be brought to
const initParam = reactive<Partial<ProjectComponents.ReqGetProjectComponentListParams>>({
  projectID: "",
  expand: "component" //  this doesn't work bc we are using enum atm.
});

const initParamProject = reactive<Partial<Project.ReqGetProjectListParams>>({
  expand: "components"
});
const projectData = ref();

// DataCallBack is processed to the returned table data. If the data returned in the background is not DataList && Total && PAGENUM && PageSize, then you can process these fields here.
const dataCallbackTree = (data: any) => {
  projectData.value = data;
  return data;
};
const dataCallbackTable = (
  data: ListResult<ProjectComponents.ReqGetProjectComponentListParams>
): PageableList<ProjectComponents.ReqGetProjectComponentListParams> => {
  return {
    list: data.items,
    total: data.totalItems,
    pageNum: data.page,
    pageSize: data.perPage
  };
};

// what binds the category tree to the table filter
const handleProjectSelect = (data: any) => {
  initParam.projectID = data.id;
  proTable.value!.clearSelection();
};

// Page button permission
const { BUTTONS } = useAuthButtons();

// Table configuration item
const columns: ColumnProps[] = [
  { type: "selection", width: 40, fixed: "left" },
  { type: "expand", label: "" },
  {
    prop: "bom_id",
    label: "ID",
    width: 60,
    sortable: true,
    search: { el: "input" }
  },
  {
    prop: "refdesignators",
    label: "Ref. Designators",
    align: "left",
    search: { el: "input" }
  },
  {
    prop: "comment",
    label: "Comment",
    align: "left",
    // width: 180,
    search: { el: "input" }
  },
  // {
  //   prop: "component",
  //   label: "MPN",
  //   width: 220,
  //   align: "left",
  //   // enum: getComponentEnum,
  //   // fieldNames: { value: "id", label: "mpn" },
  //   // sortable: true,
  //   // search: {
  //   //   el: "select",
  //   //   props: {
  //   //     value: "id",
  //   //     label: "mpn",
  //   //     multiple: true,
  //   //     filterable: true
  //   //   }
  //   // }
  //   search: { el: "input" }
  // },
  // {
  //   prop: "expand.component.id",
  //   label: "Component ID",
  //   width: 60,
  //   sortable: true,
  //   search: { el: "input" }
  // },
  // {
  //   prop: "expand.component.name",
  //   label: "Display Name",
  //   width: 260,
  //   align: "left",
  //   sortable: false,
  //   render: (_scope): string => {
  //     return `${_scope.row.expand.component.manufacturer} - ${_scope.row.expand.component.mpn}`;
  //   }
  // },
  {
    prop: "expand.component.manufacturer",
    label: "Mfr.",
    width: 130,
    align: "left",
    sortable: true,
    search: { el: "input" },
    isShow: true
  },
  {
    prop: "expand.component.mpn",
    label: "MPN",
    width: 130,
    align: "left",
    sortable: true,
    search: { el: "input" },
    isShow: true
  },
  {
    prop: "expand.component.supplier",
    label: "Supplier",
    width: 130,
    sortable: true,
    search: { el: "input" },
    isShow: false
  },
  {
    prop: "expand.component.spn",
    label: "SPN",
    width: 130,
    sortable: true,
    search: { el: "input" },
    isShow: false
  },

  {
    prop: "expand.component.description",
    label: "Desc.",
    width: 220,
    align: "left",
    search: { el: "input", key: "expand.component.description" }
  },
  {
    prop: "quantity",
    label: "Qty.",
    width: 80,
    sortable: true
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
  if (!proTable.value) {
    console.error("ProTable is not initialized");
    return;
  }
  await useHandleData(
    deleteProjectComponents,
    { projectID: String(initParam.projectID), ids },
    "Remove the selected components(s) from project"
  );
  proTable.value.getTableList();
  proTable.value.clearSelection();
};

// Batch delete footprints
const batchDeleteProject = async (ids: string[]) => {
  if (!proTree.value || !proTable.value) {
    console.error("ProTree or ProTable is not initialized");
    return;
  }
  await useHandleData(deleteProjects, { ids }, "Delete the selected projects(s)");
  proTree.value.refresh();
  proTable.value.clearSelection();
};

// Export component list
const downloadFile = async () => {
  if (!proTable.value) {
    console.error("ProTable is not initialized");
    return;
  }
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

const requestError = (err: any) => ElNotification.error({ title: "Error", message: err.message });

// Add users in batches
interface DialogExpose {
  acceptParams: (params: any) => void;
}
const dialogRefImport = ref<DialogExpose>();
const batchAdd = async () => {
  if (!initParam.projectID) {
    return;
  }
  let templateColumns = [
    { prop: "bom_id", label: "BOM ID", mergeOptions: { single: true, required: true } },
    { prop: "component", label: "MPN", uniqueKey: "mpn", mergeOptions: { single: true } },
    { prop: "quantity", label: "Quantity", mergeOptions: { required: true, defaultBoth: true } },
    { prop: "refdesignators", label: "Ref. Designators", mergeOptions: { defaultBoth: true } },
    { prop: "comment", label: "Comment", mergeOptions: { defaultBoth: true } }
  ];
  let params = {
    title: "Project Components",
    columns: templateColumns,
    uniqueKey: "bom_id",
    enumMap: proTable.value!.enumMap,
    apiGetExistingEntries: async () => await getProjectComponentsListForExport({ filter: {}, projectID: initParam.projectID! }), // existingEntries,
    apiUpload: async (data: any) => {
      // add project_id to each row
      data.forEach((row: any) => {
        row.project_id = initParam.projectID;
      });
      await postProjectComponentsUpload(data);
    },
    refresh: proTable.value!.getTableList
  };
  dialogRefImport.value!.acceptParams(params);
};

// Open the drawer (new, view, edit)
interface DrawerExpose {
  acceptParams: (params: any) => void;
}
const drawerRefComponent = ref<DrawerExpose>();
const openComponentDrawer = (title: string, rowData: Partial<ProjectComponents.ResGetProjectComponentRecord> = {}) => {
  if (!initParam.projectID) {
    return;
  }
  let params = {
    title,
    rowData: { ...rowData, _ofProjectID: initParam.projectID },
    isView: title === "View",
    apiUrl: title === "New" ? postProjectComponentAdd : title === "Edit" ? patchProjectComponentUpdate : "",
    updateTable: proTable.value!.getTableList
  };
  drawerRefComponent.value!.acceptParams(params);
};

const drawerRefProject = ref<DrawerExpose>();
const openProjectDrawer = (title: string, rowData?: Project.ResGetProjectRecord) => {
  let params = {
    title,
    rowData: { ...rowData },
    isView: title === "View",
    apiUrl: title === "New" ? postProjectCreate : title === "Edit" ? patchProjectUpdate : "",
    updateTable: proTree.value!.refresh
  };
  drawerRefProject.value!.acceptParams(params);
};
</script>
