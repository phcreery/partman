<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      pageAuthId="builds"
      :columns="columns"
      :requestApi="getProjectBuildsList"
      :initParam="initParam"
      :isPageable="true"
      :dataCallback="dataCallback"
    >
      <!-- Table header button -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('New')" v-if="BUTTONS.add">New Build</el-button>
        <el-button :icon="Download" plain @click="downloadFile" v-if="BUTTONS.export">Export</el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        <!-- {{ scope.row }} -->
        <!-- <ComponentDetails
          :title="scope.row.mpn ?? ''"
          :isView="true"
          :rowData="scope.row"
          :enum-map="proTable!.enumMap"
        ></ComponentDetails> -->
      </template>

      <!-- Table operation -->
      <!-- <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('Edit', scope.row)">Edit</el-button>
      </template> -->
    </ProTable>
    <ProjectBuildDrawer ref="drawerRef"></ProjectBuildDrawer>
  </div>
</template>

<script setup lang="tsx" name="builds">
import { ref, reactive } from "vue";
import { CirclePlus, Download } from "@element-plus/icons-vue";
import { ColumnProps, PageableList } from "@/components/ProTable/interface/index";
// import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { useDownload } from "@/hooks/useDownload";
import { JSON2CSV } from "@/hooks/useDataTransform";
// import { filterNodeMethod } from "@/utils/filterNodeMethod";
import ProTable from "@/components/ProTable/index.vue";
import ProjectBuildDrawer from "@/views/builds/components/ProjectBuildDrawer.vue";
import { ListResult, Component, ProjectBuilds } from "@/api/interface";
import {
  getProjectsEnum,
  getProjectBuildsList,
  getProjectBuildsListForExport,
  postProjectBuildsCreate
} from "@/api/modules/components";
// import ComponentDetails from "@/views/inventory/components/ComponentDetails.vue";

// Get the ProTable element and call it to get the refresh data method (you can also get the current query parameter, so that it is convenient for exporting and carrying parameters)
const proTable = ref<InstanceType<typeof ProTable>>();
// If the table needs to initialize the request parameter, it will be directly defined to the propable (each request will automatically bring the parameter every time, and it will always be brought to
const initParam = reactive({
  expand: ""
});

// DataCallBack is processed to the returned table data. If the data returned in the background is not DataList && Total && PAGENUM && PageSize, then you can process these fields here.
const dataCallback = (
  data: ListResult<ProjectBuilds.ResGetProjectBuildRecord>
): PageableList<ProjectBuilds.ResGetProjectBuildRecord> => {
  return {
    list: data.items,
    total: data.totalItems,
    pageNum: data.page,
    pageSize: data.perPage
  };
};
// Page button permission
const { BUTTONS } = useAuthButtons();

// Table configuration item
const columns: ColumnProps[] = [
  { type: "selection", width: 40, fixed: "left" },
  // { type: "expand", label: "" },
  {
    prop: "project",
    label: "Project",
    width: 120,
    enum: getProjectsEnum,
    fieldNames: { value: "id", label: "name" },
    sortable: true,
    search: {
      el: "select",
      props: {
        value: "id",
        label: "name",
        multiple: true,
        filterable: true
      }
    }
    // isShow: false
  },
  { prop: "qty", label: "Qty.", width: 80 },
  {
    prop: "comment",
    label: "Comment",
    search: { el: "input" },
    align: "left"
    // isShow: false
  },
  {
    prop: "created",
    label: "Timestamp",
    width: 200,
    sortable: true,
    search: { el: "date-picker", span: 1, props: { type: "datetimerange" } }
    // isShow: false
  }
];

// Export component list
const downloadFile = async () => {
  if (!proTable.value) return;
  let name = "all";
  let json = await getProjectBuildsListForExport({
    filter: proTable.value.searchParam
  });

  let columns = proTable.value.tableColumns.map((c: Partial<ColumnProps>) => c.prop ?? "").filter((c: string) => c);
  // remove specific columns from array
  let badColumns = ["operation", "expand", "selection", "footprint", "name"];
  columns = columns.filter((c: string) => !badColumns.includes(c));

  let csv = JSON2CSV(json, columns);
  useDownload(() => csv, `${name}_component_list`, {}, true, ".csv");
};

// Open the drawer (new, view, edit)
const drawerRef = ref<InstanceType<typeof ProjectBuildDrawer>>();
const openDrawer = (title: string, rowData?: ProjectBuilds.ResGetProjectBuildRecord) => {
  if (!proTable.value) return;
  let params = {
    title,
    rowData: rowData || ({} as ProjectBuilds.ResGetProjectBuildRecord),
    isView: title === "View",
    apiUrl: title === "New" ? postProjectBuildsCreate : undefined,
    updateTable: proTable.value.getTableList
  };
  drawerRef.value!.acceptParams(params);
};
</script>
