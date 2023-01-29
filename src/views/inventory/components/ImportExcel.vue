<template>
  <el-dialog v-model="dialogVisible" :title="`Batch Import ${parameter.title}`" :destroy-on-close="true" draggable>
    <el-row justify="center">
      <el-col :span="24">
        <el-steps :active="activeStep" finish-status="success" align-center>
          <el-step title="Step 1" description="Download Template" :icon="Download" />
          <el-step title="Step 2" description="Import Data" :icon="Upload" />
          <el-step title="Step 3" description="Review Import" :icon="View" />
        </el-steps>
        <el-row justify="space-between">
          <el-col :span="4">
            <el-button style="width: 100%; margin-top: 12px" @click="() => activeStep--">Back</el-button>
          </el-col>
          <el-col :span="4">
            <el-button style="width: 100%; margin-top: 12px" @click="() => activeStep++" type="primary">Next</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <div v-if="activeStep === 0">
      <el-row justify="center">
        <el-col :span="6">
          <el-button type="primary" :icon="Download" @click="downloadTemp">Download Template</el-button>
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
      <el-row justify="center">
        <el-col :span="24"> Reviewing... </el-col>
      </el-row>
      <el-table :data="reviewTableData" border style="width: 100%">
        <el-table-column
          v-for="column in parameter.columns"
          :key="column!.prop"
          :prop="column!.prop"
          :label="column!.label"
          width="180"
        />
      </el-table>
    </div>
  </el-dialog>
</template>

<script setup lang="ts" name="ImportExcel">
import { ref } from "vue";
import { useDownload } from "@/hooks/useDownload";
import { Download, Upload, View } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
import { JSON2CSV, CSV2JSON } from "@/hooks/useDataTransform";
import { ColumnProps } from "@/components/ProTable/interface/index";

export interface ExcelParameterProps {
  title: string; // Title
  // tempApi: (params: any) => Promise<any>; // Download the template ofApi
  columns: Partial<ColumnProps[]>; // Table column
  importApi: (params: any) => Promise<any>; // Batch ImportedApi
  refresh?: () => Promise<any>; // Get table data forApi
}

const activeStep = ref(0);
// 最大File Upload数
const excelLimit = ref(1);
// dialogStatus
const dialogVisible = ref(false);
// Parameters passed from the parent component
const parameter = ref<Partial<ExcelParameterProps>>({});

const reviewTableData = ref();

// Receive parent component parameters
const acceptParams = (params?: any): void => {
  parameter.value = params;
  dialogVisible.value = true;
};

// Excel Import Template Download
const downloadTemp = () => {
  if (!parameter.value.columns) return;
  let CSVcolumns = parameter.value.columns.map((c: any) => c.prop);
  let templateCSV = JSON2CSV({}, CSVcolumns);
  useDownload(() => templateCSV, `${parameter.value.title}`);
};

// 文件上传
const uploadExcel = async (param: any) => {
  console.log(param, typeof param.file);
  let jsonImport = await CSV2JSON(param.file);
  console.log(jsonImport);
  reviewTableData.value = jsonImport.Sheet1;
  console.log(reviewTableData.value);

  // excelFormData.append("file", param.file);
  // await parameter.value.importApi!(excelFormData);
  // parameter.value.refresh && parameter.value.refresh();
  // dialogVisible.value = false;
};

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
