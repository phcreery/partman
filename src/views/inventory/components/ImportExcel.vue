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
      <el-table :data="reviewTableData" border style="width: 100%" height="450">
        <el-table-column label="Action">
          <template #default="scope">
            <el-popover effect="light" trigger="hover" placement="top" width="auto">
              <template #default>
                <div>{{ scope.row }}</div>
              </template>
              <template #reference>
                <el-tag>{{ scope.row._action }}</el-tag>
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
import { ref, reactive, toRefs } from "vue";
import { useDownload } from "@/hooks/useDownload";
import { Download, Upload, View } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
import { JSON2CSV, CSV2JSON } from "@/hooks/useDataTransform";
import { ColumnProps } from "@/components/ProTable/interface/index";
import { filterEnum } from "@/utils/util";

import {
  // getComponentList,
  getComponentsListForExport,
  postComponentCreate,
  patchComponentUpdate
  // deleteComponents,
  // getFootprintsEnum,
  // getComponentStorageLocationEnum,
  // getComponentCategoryEnum,
  // getComponentCategoryEnumTree,
  // getStorageLocationPathEnum,
  // getStorageLocationPathEnumTree,
  // getStorageCategoryEnum,
  // getStorageCategoryEnumTree,
  // postComponentCreateBatch_Client
} from "@/api/modules/components";
import {
  // ResList,
  Component
  // ComponentCategory,
  // Footprint,
  // Storage
} from "@/api/interface";

export interface ExcelParameterProps {
  title: string; // Title
  // tempApi: (params: any) => Promise<any>; // Download the template ofApi
  columns: any; // Table column
  // importApi: (params: any) => Promise<any>; // Batch ImportedApi
  enumMap: Map<string, { [key: string]: any }[]>;
  refresh?: () => Promise<any>; // Get table data forApi
}

const activeStep = ref(0);
// 最大File Upload数
const excelLimit = ref(1);
// dialogStatus
const dialogVisible = ref(false);
// Parameters passed from the parent component
const parameter = ref<Partial<ExcelParameterProps>>({});

// const reviewTableData = ref();

// Receive parent component parameters
const acceptParams = (params?: any): void => {
  console.log("params", params);
  parameter.value = params;
  setColumns(params.columns);
  setEnumMap(params.enumMap);
  dialogVisible.value = true;
};

interface ImportColumns {
  prop: string; // keyof Component.ResGetComponentRecord
  label: string;
  apiCreate?: (params: any) => Promise<any>;
}

interface ImporterStateProps {
  columns: ImportColumns[] | undefined;
  enumMap: Map<string, { [key: string]: any }[]> | undefined;
  existingComponents: Component.ResGetComponentRecord[];
  reviewTableData: any[];
}

const useImporter = (columns: ImportColumns[] | undefined, enumMap: Map<string, { [key: string]: any }[]> | undefined) => {
  const state = reactive<ImporterStateProps>({
    columns: columns, //JSON.parse(JSON.stringify(columns)),
    enumMap: enumMap,
    existingComponents: [],
    reviewTableData: []
  });

  const getExistingComponents = async () => {
    let existingComponents = await getComponentsListForExport({ filter: {} });
    state.existingComponents = existingComponents;
  };

  const setColumns = (columns: ImportColumns[]) => {
    state.columns = columns;
  };

  const setEnumMap = (enumMap: Map<string, { [key: string]: any }[]>) => {
    state.enumMap = enumMap;
  };

  const findExistingComponent = (component: any) => {
    let existingComponent = state.existingComponents.find((c: any) => {
      return c.mpn === component.mpn;
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
    let newTableData = await initializeTableData(tableData);
    newTableData ? (state.reviewTableData = newTableData) : (state.reviewTableData = []);
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

    // go through and add _action of "new" to each row
    sanitizedTableData.forEach((row: any) => {
      row._action = "new";
      // row._action_component = "new";
      // row._action_category = "new";
      // row._action_storage_location = "new";
    });

    // see if component already exists
    await getExistingComponents();
    sanitizedTableData.forEach((row: any) => {
      let existingComponent = findExistingComponent(row);
      if (existingComponent) {
        row._action = "update";
        row.id = existingComponent.id;
      }
    });

    return sanitizedTableData;
  };

  const evaluateEnum = async (row: any) => {
    console.log("enumMap", state.enumMap);
    if (!state.columns) return row;
    if (!state.enumMap) return row;

    for (let col in row) {
      console.log("col", col, row[col]);
      if (row[col] === undefined || row[col] === "") continue;

      let apiCreateFunc = state.columns.find((c: any) => c.prop === col)?.apiCreate;
      // does this value exist in the enumMap?
      if (!state.enumMap.get(col)) {
        console.log("no enumMap found for", col);
        continue;
      }
      let value = state.enumMap.get(col)?.find((e: any) => e.name === row[col])?.value;
      console.log("enum value", value);
      if (!value) {
        // no enum value found
        console.log("no enum value found, gotta create one for", row[col]);
        if (apiCreateFunc) {
          console.log("creating with apiCreateFunc", apiCreateFunc);
          // let res = await apiCreateFunc({name: row[col]});
          // console.log("res", res); // TODO: get id from res
          // row[col] = res.id;
        } else {
          console.log("no apiCreateFunc found, defaulting to empty string");
          row[col] = "";
        }
      } else {
        row[col] = value;
      }
    }
    return row;
  };

  const importTableData = async () => {
    // remove internal keys that start with _
    const removeInternalKeys = (obj: any) => {
      Object.keys(obj).forEach(key => {
        if (key.startsWith("_")) {
          delete obj[key];
        }
      });
      return obj;
    };
    let tableData = JSON.parse(JSON.stringify(state.reviewTableData));
    let component: Component.ComponentColumns;
    for (let row of tableData) {
      if (row._action === "new") {
        component = removeInternalKeys(row);
        component = await evaluateEnum(component);
        console.log("creating", component);
        // let res = await postComponentCreate(component);
        // console.log(res);
      } else if (row._action === "update") {
        component = removeInternalKeys(row);
        Object.assign(component, { id: row.id });
        console.log("updating", component);
        // let res = await patchComponentUpdate(component as Component.ReqUpdateComponentParams);
      } else {
        console.log("skipping", row);
      }
    }

    parameter.value.refresh && parameter.value.refresh();
    dialogVisible.value = false;
  };

  getExistingComponents();

  return {
    ...toRefs(state),
    setColumns,
    setEnumMap,
    downloadTemplate,
    uploadExcel,
    importTableData
  };
};

const {
  columns,
  enumMap,
  existingComponents,
  reviewTableData,
  setColumns,
  setEnumMap,
  downloadTemplate,
  uploadExcel,
  importTableData
} = useImporter(parameter.value.columns, parameter.value.enumMap);

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
      title: "Warm Tips",
      message: "Upload files can only be xls / xlsx / csv!",
      type: "warning"
    });
  if (!fileSize)
    ElNotification({
      title: "Warm Tips",
      message: "Upload file size cannot exceed 5MB!",
      type: "warning"
    });
  return isExcel && fileSize;
};

// File count exceeds prompt
const handleExceed = (): void => {
  ElNotification({
    title: "Warm Tips",
    message: "Maximum of one file upload!",
    type: "warning"
  });
};

// Upload error message
const excelUploadError = (): void => {
  ElNotification({
    title: "Warm Tips",
    message: `Batch Add ${parameter.value.title} Failure, Please re-upload!`,
    type: "error"
  });
};

// 上传Success提示
const excelUploadSuccess = (): void => {
  ElNotification({
    title: "Warm Tips",
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