<template>
  <div>
    <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerData.title} Component`">
      <!-- Drawer Data: {{ drawerData.rowData }} -->
      <el-form
        ref="ruleFormRef"
        :rules="rules"
        :disabled="drawerData.isView"
        :model="drawerData.rowData"
        label-width="130px"
        label-suffix=" :"
        :append-to-body="true"
      >
        <!-- {{ drawerData.rowData!.image }} -->
        <el-form-item label="Image" prop="avatar">
          <UploadImg
            v-model:imageName="drawerData.rowData!.image"
            :imageUrl="getFileUrl(drawerData.rowData, drawerData.rowData!.image)"
            rowParam="image"
            :api="(d: FormData) => drawerData.apiUrl!(d, drawerData.rowData!.id)"
            :disabled="drawerData.isView"
            :upload-style="{ width: '120px', height: '120px' }"
            @check-validate="checkValidate('image')"
          >
            <!-- <template #tip> The size cannot exceed 3M </template> -->
          </UploadImg>
        </el-form-item>
        <el-form-item label="MPN" prop="mpn">
          <div class="form-item-with-buttons">
            <el-space>
              <el-input v-model="drawerData.rowData!.mpn" placeholder="Please fill in the component name" clearable></el-input>
              <el-button :icon="Search" @click="openOctopartComponentDrawer('Import', drawerData.rowData)" />
            </el-space>
          </div>
        </el-form-item>
        <el-form-item label="Manufacturer" prop="manufacturer">
          <el-input
            v-model="drawerData.rowData!.manufacturer"
            placeholder="Please fill in the component manufacturer"
            clearable
            autosize
          >
          </el-input>
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input
            v-model="drawerData.rowData!.description"
            placeholder="Please fill in the component description"
            clearable
            :rows="4"
            type="textarea"
            autosize
          >
          </el-input>
        </el-form-item>
        <el-form-item label="IPN" prop="ipn">
          <el-input v-model="drawerData.rowData!.ipn" placeholder="Internal Part Number" clearable></el-input>
        </el-form-item>
        <el-form-item label="Supplier" prop="supplier">
          <el-input v-model="drawerData.rowData!.supplier" placeholder="Supplier" clearable></el-input>
        </el-form-item>
        <el-form-item label="SPN" prop="spn">
          <el-input v-model="drawerData.rowData!.spn" placeholder="Supplier Part Number" clearable></el-input>
        </el-form-item>
        <el-form-item label="Category" prop="category" v-loading="componentCategories === undefined">
          <div class="form-item-with-buttons">
            <el-space>
              <!-- <el-select v-model="drawerData.rowData!.category" placeholder="" clearable>
                    <el-option v-for="item in componentCategories" :key="item.id" :label="item.name" :value="item.id" />
                </el-select> -->
              <!-- <el-cascader v-model="drawerData.rowData!.category" :options="componentCategories" :props="cascaderProps" /> -->
              <el-tree-select
                v-model="drawerData.rowData!.category"
                :multiple="false"
                :data="componentCategories"
                :props="treeSelectProps"
                clearable
                :render-after-expand="false"
                :checkStrictly="true"
                filterable
                :filter-node-method="filterNodeMethod"
              />
              <el-button-group>
                <el-button :icon="Refresh" @click="refreshCategories" />
                <el-button :icon="Plus" @click="openComponentCategoryDrawer('New')" />
              </el-button-group>
            </el-space>
          </div>
        </el-form-item>
        <el-form-item label="Footprint" prop="footprint" v-loading="componentFootprints === undefined">
          <div class="form-item-with-buttons">
            <el-space>
              <el-select v-model="drawerData.rowData!.footprint" placeholder="" clearable filterable style="width: max-content">
                <el-option v-for="item in componentFootprints" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
              <el-button-group>
                <el-button :icon="Refresh" @click="refreshFootprints" />
                <el-button :icon="Plus" @click="openFootprintDrawer('New')" />
              </el-button-group>
            </el-space>
          </div>
        </el-form-item>
        <el-form-item label="Storage Location" prop="storage_location" v-loading="componentStorageLocations === undefined">
          <div class="form-item-with-buttons">
            <el-space>
              <!-- <el-select v-model="drawerData.rowData!.storage_location" placeholder="" clearable filterable>
                <el-option v-for="item in componentStorageLocations" :key="item.id" :label="item.name" :value="item.id" />
              </el-select> -->
              <el-tree-select
                v-model="drawerData.rowData!.storage_location"
                :multiple="false"
                :data="componentStorageLocations"
                :props="treeSelectProps"
                clearable
                :render-after-expand="false"
                :checkStrictly="true"
                filterable
                :filter-node-method="filterNodeMethod"
              />
              <el-button-group>
                <el-button :icon="Refresh" @click="refreshStorageLocations" />
                <el-button :icon="Plus" @click="openStorageDrawer('New')" />
              </el-button-group>
            </el-space>
          </div>
        </el-form-item>
        <el-form-item label="Stock" prop="stock">
          <el-input-number v-model="drawerData.rowData!.stock" />
        </el-form-item>
        <!-- Specs {{ drawerData.rowData!.specs }} -->
        <el-form-item v-for="(domain, index) in drawerData.rowData!.specs" :key="index" label="Spec" :prop="index + '.value'">
          <el-input style="margin-bottom: 6px" v-model="domain.attribute.name" placeholder="Attribute" />
          <div class="form-item-with-buttons">
            <el-space>
              <el-input v-model="domain.value" placeholder="Value" />
              <el-input v-model="domain.units" placeholder="Units" />
              <!-- <el-button-group>
                                <el-button :icon="Refresh" @click="refreshCategories" />
                                <el-button :icon="Plus" @click="openFootprintDrawer('New')" />
                            </el-button-group> -->

              <el-button type="danger" :icon="Delete" @click.prevent="deleteSpecIndex(index)"></el-button>
            </el-space>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="addSpec">New spec</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="drawerVisible = false">Cancel</el-button>
        <el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">Save</el-button>
      </template>
    </el-drawer>

    <FootprintDrawer ref="drawerRefNestedFootprint"></FootprintDrawer>
    <StorageDrawer ref="drawerRefNestedStorage"></StorageDrawer>
    <ComponentCategoryDrawer ref="drawerRefNestedComponentCategory"></ComponentCategoryDrawer>
    <OctopartComponentDrawer ref="drawerRefNestedOctopartComponent"></OctopartComponentDrawer>
  </div>
</template>

<script setup lang="ts" name="ComponentDrawer">
import { ref, reactive, watch } from "vue";
import { Refresh, Plus, Search, Delete } from "@element-plus/icons-vue";
import { ElMessage, FormInstance } from "element-plus";
// import { genderType } from "@/utils/serviceDict";
import {
  Component,
  ComponentCategory,
  Footprint,
  Storage
  // StorageCategory
} from "@/api/interface";
import {
  getFileUrl,
  getFootprintsEnum,
  // getComponentStorageLocationEnum,
  getStorageLocationPathEnumTree,
  getComponentCategoryEnumTree,
  postFootprintCreate,
  postStorageCreate,
  postComponentCategoryCreate
} from "@/api/modules/components";
import { nestedObjectAssign } from "@/utils/nestedObjectAssign";
import UploadImg from "@/components/Upload/Img.vue";
import FootprintDrawer from "@/views/footprints/components/FootprintDrawer.vue";
import StorageDrawer from "@/views/storage/components/StorageDrawer.vue";
import ComponentCategoryDrawer from "@/views/categories/components/ComponentCategoryDrawer.vue";
import OctopartComponentDrawer from "@/views/inventory/components/OctopartComponentDrawer.vue";

const rules = reactive({
  mpn: [{ required: true, message: "Please upload the component name", trigger: "change" }],
  manufacturer: [{ required: false, message: "Please enter component manufacturer", trigger: "change" }],
  description: [{ required: false, message: "Please enter component description", trigger: "change" }],
  ipn: [{ required: false, message: "Please fill in IPN", trigger: "change" }],
  supplier: [{ required: false, message: "Please fill in supplier", trigger: "change" }],
  spn: [{ required: false, message: "Please fill in supplier part number", trigger: "change" }],
  category: [{ required: false, message: "Please select category", trigger: "change" }],
  footprint: [{ required: false, message: "Please fill in the footprint", trigger: "change" }],
  storage_location: [{ required: false, message: "Please select location", trigger: "change" }],
  stock: [{ required: true, message: "Please fill in the stock qty", trigger: "change" }]
});

// const cascaderProps = { value: "id", label: "name", emitPath: false };
const treeSelectProps = { value: "id", label: "name", disabled: "disabled", emitPath: false };

export interface DrawerProps {
  title: string;
  isView: boolean;
  rowData: Component.ResGetComponentRecord;
  apiUrl?: (params: any, id?: string) => Promise<any>;
  updateTable?: () => Promise<any>;
}

// drawer frame status
const drawerVisible = ref(false);
const drawerData = ref<DrawerProps>({
  isView: false,
  title: "",
  rowData: {} as Component.ResGetComponentRecord
});

// Parameters transmitted from the parent component
const acceptParams = (params: DrawerProps): void => {
  drawerData.value = params;
  drawerVisible.value = true;
};

const importRowData = (rowData: Component.ResGetComponentRecord) => {
  nestedObjectAssign(drawerData.value.rowData, rowData);
  // drawerData.value.rowData = rowData;
};

const ruleFormRef = ref<FormInstance>();
// Submit data (new/edit)
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerData.value.apiUrl!(drawerData.value.rowData);
      ElMessage.success({ message: `${drawerData.value.title} component success!` });
      drawerData.value.updateTable!();
      drawerVisible.value = false;
    } catch (error) {
      console.error(error);
    }
  });
};

// Public verification method (the picture upload successfully triggers re -verification)
const checkValidate = (val: string) => {
  ruleFormRef.value!.validateField(val, () => {});
};

// TreeSelect search function
const filterNodeMethod = (value: string, data: ComponentCategory.ResGetComponentCategoryRecord) => {
  return data.name.toLowerCase().includes(value.toLowerCase());
};

const addSpec = () => {
  // check to see if there are any specs, if not, initialize spec parameter
  if (
    typeof drawerData.value.rowData?.specs !== "object" ||
    drawerData.value.rowData?.specs === null ||
    drawerData.value.rowData?.specs === undefined
  ) {
    drawerData.value.rowData!.specs = [];
  }
  drawerData.value.rowData?.specs.push({ attribute: { name: "", shortname: "", group: "" }, value: "", units: "" });
};

const deleteSpecIndex = (index: number) => {
  drawerData.value.rowData?.specs?.splice(index, 1);
};

const componentCategories = ref<ComponentCategory.ResGetComponentCategoryRecord[]>();
const componentStorageLocations = ref<Storage.ResGetStorageRecordTree[]>();
const componentFootprints = ref<Footprint.ResGetFootprintRecord[]>();

const refreshCategories = () => getComponentCategoryEnumTree().then(res => (componentCategories.value = res));
const refreshStorageLocations = () =>
  getStorageLocationPathEnumTree().then(res => {
    componentStorageLocations.value = res;
  });
const refreshFootprints = () => getFootprintsEnum().then(res => (componentFootprints.value = res));

// When opening the drawer, fetch the necessary field values
watch(drawerVisible, openValue => {
  if (openValue) {
    refreshCategories();
    refreshStorageLocations();
    refreshFootprints();
  }
});

// Open the drawer (new, view, edit)
export interface DrawerExpose {
  acceptParams: (params: any) => void;
}
// New Footprint Drawer
const drawerRefNestedFootprint = ref<DrawerExpose>();
const openFootprintDrawer = (title: string, rowData: Partial<Footprint.ResGetFootprintRecord> = {}) => {
  let params = {
    title,
    rowData: { ...rowData },
    isView: title === "View",
    apiUrl: title === "New" ? postFootprintCreate : "",
    updateTable: refreshFootprints // proTable.value.refresh
  };
  drawerRefNestedFootprint.value!.acceptParams(params);
};

// New Storage Drawer
const drawerRefNestedStorage = ref<DrawerExpose>();
const openStorageDrawer = (title: string, rowData: Partial<Storage.ResGetStorageRecord> = {}) => {
  let params = {
    title,
    rowData: { ...rowData },
    isView: title === "View",
    apiUrl: title === "New" ? postStorageCreate : "",
    updateTable: refreshStorageLocations
  };
  drawerRefNestedStorage.value!.acceptParams(params);
};

// New Component Category Drawer
const drawerRefNestedComponentCategory = ref<DrawerExpose>();
const openComponentCategoryDrawer = (title: string, rowData: Partial<ComponentCategory.ResGetComponentCategoryRecord> = {}) => {
  let params = {
    title,
    rowData: { ...rowData },
    isView: title === "View",
    apiUrl: title === "New" ? postComponentCategoryCreate : "",
    updateTable: refreshCategories
  };
  drawerRefNestedComponentCategory.value!.acceptParams(params);
};

// Search Octopart Drawer
const drawerRefNestedOctopartComponent = ref<DrawerExpose>();
const openOctopartComponentDrawer = (title: string, rowData: Partial<Component.ResGetComponentRecord> = {}) => {
  let params = {
    title,
    rowData: { ...rowData },
    isView: title === "View",
    apiUrl: importRowData,
    updateTable: () => {}
  };
  drawerRefNestedOctopartComponent.value!.acceptParams(params);
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
