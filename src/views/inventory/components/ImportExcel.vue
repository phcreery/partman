<template>
  <el-dialog v-model="dialogVisible" :title="`Batch Import ${parameter.title}`" :destroy-on-close="true" draggable>
    <el-row justify="center">
      <el-col :span="24">
        <el-steps :active="activeStep" finish-status="success" align-center>
          <el-step title="Step 1" description="Download Template" :icon="Download" />
          <el-step title="Step 2" description="Import Data" :icon="Upload" />
          <el-step title="Step 3" description="Review Import" :icon="View" />
        </el-steps>
      </el-col>
    </el-row>
    <el-row justify="space-between">
      <el-col :span="4">
        <el-button style="width: 100%; margin-top: 12px" @click="() => activeStep--">Back</el-button>
      </el-col>
      <el-col :span="4">
        <div v-if="activeStep === 2">
          <el-button style="width: 100%; margin-top: 12px" @click="importTableData" type="primary"> Import </el-button>
        </div>
        <div v-else>
          <el-button style="width: 100%; margin-top: 12px" @click="() => activeStep++" type="primary"> Next </el-button>
        </div>
      </el-col>
    </el-row>

    <div v-if="activeStep === 0">
      <el-row justify="center">
        <el-col :span="6">
          <el-button type="primary" :icon="Download" @click="downloadTemplate">Download Template</el-button>
        </el-col>
      </el-row>
    </div>

    <div v-if="activeStep === 1">
      <el-row justify="center">
        <el-col>
          <el-switch v-model="mergeComponents" active-text="Merge items if possible" inactive-text="Only create new items" />
        </el-col>
      </el-row>
      <el-row justify="center">
        <el-col :span="24">
          <el-upload
            action="string"
            class="upload"
            :drag="true"
            :limit="excelLimit"
            :multiple="true"
            :show-file-list="true"
            :http-request="uploadExcel"
            :before-upload="beforeExcelUpload"
            :on-exceed="handleExceed"
            :on-success="excelUploadSuccess"
            :on-error="excelUploadError"
            accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
          >
            <el-icon><upload-filled /></el-icon>
            <div>Drag the file here, or <em>Click to upload</em></div>
            <template #tip>
              <div>Please upload .xls , .xlsx , or .csv in standard file format</div>
            </template>
          </el-upload>
        </el-col>
      </el-row>
    </div>

    <div v-if="activeStep === 2">
      <el-table :data="tableDataReviewed" border style="width: 100%" height="450">
        <el-table-column label="Action">
          <template #default="scope">
            <el-popover effect="light" trigger="hover" placement="top" width="auto">
              <template #default>
                <div>{{ scope.row }}</div>
              </template>
              <template #reference>
                <el-tag v-if="scope.row._action === 'new'">{{ scope.row._action }}</el-tag>
                <el-tag v-if="scope.row._action === 'update'" type="warning">{{ scope.row._action }}</el-tag>
                <el-tag v-else type="warning">{{ scope.row._action }}</el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-for="column in columns" :key="column!.prop" :prop="column!.prop" :label="column!.label" width="180" />
      </el-table>
    </div>
  </el-dialog>
</template>

<script setup lang="ts" name="ImportExcel">
import { ref, reactive, toRef, watch, computed } from "vue";
import { useDownload } from "@/hooks/useDownload";
import { Download, Upload, View } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
import { JSON2CSV, CSV2JSON } from "@/hooks/useDataTransform";
// import { filterEnum } from "@/utils/util";
import { MergeColumnOptions, useMerger } from "@/hooks/useMerger";

export interface DrawerProps {
  title: string; // Title
  columns: any; // Table column
  uniqueKey: string; // Unique key
  enumMap: Map<string, { [key: string]: any }[]>;
  apiGetExistingEntries: () => Promise<any[]>; // Existing entriesApi
  apiUpload: (params: any) => Promise<any>;
  refresh?: () => Promise<any>; // Get table data forApi
}

const activeStep = ref(0);
// 最大File Upload数
const excelLimit = ref(1);
// dialogStatus
const dialogVisible = ref(false);
// Parameters passed from the parent component
const parameter = ref<Partial<DrawerProps>>({});

// const tableDataReviewed = ref();
const mergeComponents = ref(true);

// Receive parent component parameters
const acceptParams = (params?: any): void => {
  console.log("params", params);
  parameter.value = params;
  acceptProps({
    columns: params.columns,
    uniqueKey: params.uniqueKey,
    enumMap: params.enumMap,
    apiGetExistingEntries: params.apiGetExistingEntries
    // refresh: params.refresh
  });
  activeStep.value = 0;
  dialogVisible.value = true;
};

interface ImportColumns {
  prop: string;
  label: string;
  uniqueKey?: string;
  mergeOptions: Partial<MergeColumnOptions>;
}

interface ImporterStateProps {
  columns: ImportColumns[] | undefined;
  uniqueKey: string | undefined;
  enumMap: Map<string, { [key: string]: any }[]> | undefined;
  existingEntries: any[] | undefined;
  tableData: any[];
  tableDataReviewed: any[];
}

const useImporter = (
  columns: ImportColumns[] | undefined,
  uniqueKey: string | undefined,
  enumMap: Map<string, { [key: string]: any }[]> | undefined
) => {
  let apiGetExistingEntries: () => Promise<any[]> = async () => [];
  const state = reactive<ImporterStateProps>({
    columns: columns,
    uniqueKey: uniqueKey,
    enumMap: enumMap,
    existingEntries: [],
    tableData: [],
    tableDataReviewed: []
  });

  // set mergeColumns as computed from columns
  const mergeColumnOptions = computed(() => {
    if (!state.columns) return;
    return state.columns.map(column => {
      return {
        prop: column.prop,
        label: column.label,
        ...column.mergeOptions
      };
    });
  });

  const getExistingEntries = async () => {
    if (!apiGetExistingEntries) return;
    state.existingEntries = await apiGetExistingEntries();
  };

  const addToExistingEntries = (newEntry: any) => {
    if (!state.existingEntries) return;
    state.existingEntries.push(newEntry);
  };

  const acceptProps = (props: Partial<ImporterStateProps> & { apiGetExistingEntries: () => Promise<any[]> }) => {
    state.columns = props.columns;
    state.uniqueKey = props.uniqueKey;
    state.enumMap = props.enumMap;
    state.existingEntries = props.existingEntries;
    apiGetExistingEntries = props.apiGetExistingEntries;
  };

  const findExistingComponent = (component: any) => {
    if (!state.uniqueKey) return;
    if (!state.existingEntries) return;
    let existingComponent = state.existingEntries.find((c: any) => {
      return c[state.uniqueKey!] === component[state.uniqueKey!];
    });
    return existingComponent;
  };

  // Excel Import Template Download
  const downloadTemplate = () => {
    if (!state.columns) return;
    let CSVcolumns = state.columns.map((c: any) => c.prop);
    let templateCSV = JSON2CSV({}, CSVcolumns);
    useDownload(() => templateCSV, `template`);
  };

  // 文件上传
  const uploadExcel = async (param: any) => {
    let json = await CSV2JSON(param.file);
    let tableData = json.Sheet1;
    tableData ? (state.tableData = tableData) : (state.tableData = []);
  };

  const initializeTableData = async (tableData: any) => {
    // go through and sanitize each row so that it adheres to parameter.value.columns format
    if (!parameter.value.columns) return;
    let sanitizedTableData: any[] = [];
    tableData.forEach((row: any) => {
      let cleanRow = {};
      state.columns?.forEach((column: any) => {
        Object.assign(cleanRow, { [column.prop]: row[column.prop] });
      });
      sanitizedTableData.push(cleanRow);
    });

    // see if component already exists
    await getExistingEntries();
    sanitizedTableData.forEach((row: any) => {
      let existingComponent = findExistingComponent(row);
      if (existingComponent && mergeComponents.value) {
        row._action = "update";
        row.id = existingComponent.id;
        row._existingComponent = existingComponent; // is this needed?
      } else {
        row._action = "new";
        // add to existingEntries so that we don't create duplicates
        addToExistingEntries(row);
      }
    });

    return sanitizedTableData;
  };

  const importTableData = async () => {
    let tableData = JSON.parse(JSON.stringify(state.tableDataReviewed));

    let tableDataPostProcessed: any[] = [];

    let component;
    for (let row of tableData) {
      component = row;
      component.action = "new";
      if (row._action === "update") {
        let existingComponent = findExistingComponent(row);
        console.log("merging", component);

        let {
          mergeColumns,
          leftComponent,
          rightComponent,
          setLeftComponent,
          setRightComponent,
          intelligentCheck,
          mergedComponent
        } = useMerger(mergeColumnOptions.value as MergeColumnOptions[]);
        console.log(mergeColumns, leftComponent, rightComponent);
        setLeftComponent(component);
        setRightComponent(existingComponent);
        // TODO: option to swap left and right (Merge priority: Existing Data / New Data)
        intelligentCheck();
        console.log("merged to ", mergedComponent.value);
        component = mergedComponent.value as any;
        component.action = "update";
      }
      tableDataPostProcessed.push(component);
    }

    console.log("tableData (sending to server)", tableDataPostProcessed);
    try {
      let res = await parameter.value.apiUpload!(tableDataPostProcessed);
      console.log(res);
    } catch (e) {
      console.error("error updating component", e);
    }

    parameter.value.refresh && parameter.value.refresh();
    dialogVisible.value = false;
  };

  getExistingEntries();

  return {
    // ...toRefs(state),
    columns: toRef(state, "columns"),
    tableData: toRef(state, "tableData"),
    tableDataReviewed: toRef(state, "tableDataReviewed"),
    acceptProps,
    downloadTemplate,
    uploadExcel,
    initializeTableData,
    importTableData
  };
};

// technically the parameters here are unused since they are passed in via the useImporter hook
const {
  columns,
  tableData,
  tableDataReviewed,
  acceptProps,
  downloadTemplate,
  uploadExcel,
  initializeTableData,
  importTableData
} = useImporter(parameter.value.columns, parameter.value.uniqueKey, parameter.value.enumMap);

// console.log(uniqueKey, enumMap, existingEntries); // just to get rid of unused variable warnings

// watch changes in currentstep and update the table data
watch(
  () => activeStep.value,
  async () => {
    if (activeStep.value === 2) {
      // console.log("currentStep changed to 2, updating table data");
      let newTableData = await initializeTableData(tableData.value);
      newTableData ? (tableDataReviewed.value = newTableData) : (tableDataReviewed.value = []);
    }
  }
);

/**
 * @description Judgment before file upload
 * @param file Uploaded files
 * */
const beforeExcelUpload = (file: any) => {
  const isExcel =
    file.type === "application/vnd.ms-excel" ||
    file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.type === ".csv" ||
    file.type === "text/csv";
  const fileSize = file.size / 1024 / 1024 < 5;
  if (!isExcel)
    ElNotification({
      title: "Notification",
      message: "Upload files can only be xls / xlsx / csv!",
      type: "warning"
    });
  if (!fileSize)
    ElNotification({
      title: "Notification",
      message: "Upload file size cannot exceed 5MB!",
      type: "warning"
    });
  return isExcel && fileSize;
};

// File count exceeds prompt
const handleExceed = (): void => {
  ElNotification({
    title: "Notification",
    message: "Maximum of one file upload!",
    type: "warning"
  });
};

// Upload error message
const excelUploadError = (): void => {
  ElNotification({
    title: "Notification",
    message: `Batch Add ${parameter.value.title} Failure, Please re-upload!`,
    type: "error"
  });
};

// 上传Success提示
const excelUploadSuccess = (): void => {
  ElNotification({
    title: "Notification",
    message: `Batch Add ${parameter.value.title} success!`,
    type: "success"
  });
};

defineExpose({
  acceptParams
});
</script>
<style lang="scss" scoped>
// @import "./index.scss";
</style>
