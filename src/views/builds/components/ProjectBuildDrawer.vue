<template>
  <div>
    <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerData.title} Build`">
      <el-form
        ref="ruleFormRef"
        :rules="rules"
        :disabled="drawerData.isView"
        :model="drawerData.rowData"
        label-width="130px"
        label-suffix=" :"
        :append-to-body="true"
      >
        <el-form-item label="Project" prop="project" v-loading="componentProjects === undefined">
          <div class="form-item-with-buttons">
            <el-space>
              <el-select v-model="drawerData.rowData!.project" placeholder="" clearable filterable style="width: max-content">
                <el-option v-for="item in componentProjects" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
              <el-button-group>
                <el-button :icon="Refresh" @click="refreshProjects" />
                <el-button :icon="Plus" @click="openProjectDrawer('New')" />
              </el-button-group>
            </el-space>
          </div>
        </el-form-item>
        <el-form-item label="Quantity" prop="qty">
          <el-input-number v-model="drawerData.rowData!.qty" />
        </el-form-item>
        <el-form-item label="Comment" prop="comment">
          <el-input
            v-model="drawerData.rowData!.comment"
            placeholder="Please fill in the build comment"
            clearable
            :rows="4"
            type="textarea"
            autosize
          >
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="drawerVisible = false">Cancel</el-button>
        <el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">Save</el-button>
      </template>
    </el-drawer>

    <ProjectDrawer ref="drawerRefNestedProject"></ProjectDrawer>
  </div>
</template>

<script setup lang="ts" name="ComponentDrawer">
import { ref, reactive, watch } from "vue";
import { Refresh, Plus } from "@element-plus/icons-vue";
import { ElMessage, FormInstance } from "element-plus";
// import { genderType } from "@/utils/serviceDict";
import {
  Project,
  ProjectBuilds
  // StorageCategory
} from "@/api/interface";
import { getProjectsEnum, postProjectCreate } from "@/api/modules/components";
// import { nestedObjectAssign } from "@/utils/nestedObjectAssign";
// import UploadImg from "@/components/UploadImg/index.vue";
import ProjectDrawer from "@/views/projects/components/ProjectDrawer.vue";

const rules = reactive({
  mpn: [{ required: true, message: "Please upload the component name", trigger: "change" }],
  description: [{ required: false, message: "Please enter component description", trigger: "change" }],
  manufacturer: [{ required: false, message: "Please enter component manufacturer", trigger: "change" }],
  footprint: [{ required: false, message: "Please fill in the footprint", trigger: "change" }],
  stock: [{ required: true, message: "Please fill in the stock qty", trigger: "change" }],
  storage_location: [{ required: false, message: "Please select location", trigger: "change" }],
  category: [{ required: false, message: "Please select category", trigger: "change" }],
  ipn: [{ required: false, message: "Please fill in IPN", trigger: "change" }]
});

// const cascaderProps = { value: "id", label: "name", emitPath: false };
// const treeSelectProps = { value: "id", label: "name", disabled: "disabled", emitPath: false };

interface DrawerProps {
  title: string;
  isView: boolean;
  rowData?: ProjectBuilds.ResGetProjectBuildRecord;
  apiUrl?: (params: any) => Promise<any>;
  updateTable?: () => Promise<any>;
}

// drawer frame status
const drawerVisible = ref(false);
const drawerData = ref<DrawerProps>({
  isView: false,
  title: ""
});

// Parameters transmitted from the parent component
const acceptParams = (params: DrawerProps): void => {
  drawerData.value = params;
  drawerVisible.value = true;
};

const ruleFormRef = ref<FormInstance>();
// Submit data (new/edit)
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerData.value.apiUrl!(drawerData.value.rowData);
      ElMessage.success({ message: `${drawerData.value.title} build success!` });
      drawerData.value.updateTable!();
      drawerVisible.value = false;
    } catch (error) {
      console.error(error);
    }
  });
};

// Public verification method (the picture upload successfully triggers re -verification)
// const checkValidate = (val: string) => {
// 	ruleFormRef.value!.validateField(val, () => {});
// };

const componentProjects = ref<Project.ResGetProjectRecord[]>();

const refreshProjects = () => getProjectsEnum().then(res => (componentProjects.value = res.data));

// When opening the drawer, fetch the necessary field values
watch(drawerVisible, openValue => {
  if (openValue) {
    refreshProjects();
  }
});

// Open the drawer (new, view, edit)
interface DrawerExpose {
  acceptParams: (params: any) => void;
}
// New Footprint Drawer
const drawerRefNestedProject = ref<DrawerExpose>();
const openProjectDrawer = (title: string, rowData: Partial<Project.ResGetProjectRecord> = {}) => {
  let params = {
    title,
    rowData: { ...rowData },
    isView: title === "View",
    apiUrl: title === "New" ? postProjectCreate : "",
    updateTable: refreshProjects // proTable.value.refresh
  };
  drawerRefNestedProject.value!.acceptParams(params);
};

defineExpose({
  acceptParams
});
</script>

<style lang="scss">
.form-item-with-buttons {
  width: 100%;
  .el-space {
    width: 100%;
    .el-space__item {
      &:first-child {
        width: 100%;
      }
      &:last-child {
        margin-right: 0 !important;
      }
      & > .el-button-group {
        width: max-content;
      }
    }
  }
}
</style>
