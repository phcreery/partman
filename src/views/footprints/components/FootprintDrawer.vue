<template>
  <div>
    <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerData.title} Footprint`">
      <el-form
        ref="ruleFormRef"
        :rules="rules"
        :disabled="drawerData.isView"
        :model="drawerData.rowData"
        label-width="130px"
        label-suffix=" :"
        :append-to-body="true"
      >
        <!-- <el-form-item label="profile picture" prop="avatar">
				<UploadImg
					v-model:imageUrl="drawerData.rowData!.avatar"
					:disabled="drawerData.isView"
					:upload-style="{ width: '120px', height: '120px' }"
					@check-validate="checkValidate('avatar')"
				>
					<template #tip> The size cannot exceed 3M </template>
				</UploadImg>
			</el-form-item> -->
        <el-form-item label="Name" prop="name">
          <el-input v-model="drawerData.rowData!.name" placeholder="Please fill in the footprint name" clearable></el-input>
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input
            v-model="drawerData.rowData!.description"
            placeholder="Please fill in the footprint description"
            clearable
            :rows="4"
            type="textarea"
            autosize
          ></el-input>
        </el-form-item>
        <el-form-item label="Category" prop="category" v-loading="footprintCategories === undefined">
          <!-- <el-select v-model="drawerData.rowData!.category" placeholder="" clearable>
					<el-option v-for="item in footprintCategories" :key="item.id" :label="item.name" :value="item.id" />
				</el-select> -->
          <!-- <el-cascader v-model="drawerData.rowData!.category" :options="footprintCategories" :props="cascaderProps" /> -->
          <!-- <el-tree-select
						v-model="drawerData.rowData!.category"
						:multiple="false"
						:data="footprintCategories"
						:props="treeSelectProps"
						clearable
						:render-after-expand="false"
						:checkStrictly="true"
					/> -->
          <div class="form-item-with-buttons">
            <el-space>
              <el-tree-select
                v-model="drawerData.rowData!.category"
                :multiple="false"
                :data="footprintCategories"
                :props="treeSelectProps"
                clearable
                :render-after-expand="false"
                :checkStrictly="true"
              />
              <el-button-group>
                <el-button :icon="Refresh" @click="refreshFootprintCategories" />
                <el-button :icon="Plus" @click="openNestedFootprintCategoryDrawer('New')" />
              </el-button-group>
            </el-space>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="drawerVisible = false">Cancel</el-button>
        <el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">Save</el-button>
      </template>
    </el-drawer>

    <FootprintCategoryDrawer ref="drawerRefFootprintCategory"></FootprintCategoryDrawer>
  </div>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive, watch } from "vue";
// import { genderType } from "@/utils/serviceDict";
import { Footprint, FootprintCategory } from "@/api/interface";
import { getFootprintCategoryEnumTree, postFootprintCategoryCreate } from "@/api/modules/components";
import { ElMessage, FormInstance } from "element-plus";
// import UploadImg from "@/components/UploadImg/index.vue";
import { Refresh, Plus } from "@element-plus/icons-vue";
import FootprintCategoryDrawer from "@/views/footprints/components/FootprintCategoryDrawer.vue";

const rules = reactive({
  name: [{ required: true, message: "Please upload the footprint name", trigger: "change" }],
  description: [{ required: false, message: "Please fill in the description", trigger: "change" }],
  category: [{ required: false, message: "Please select category", trigger: "change" }]
});

// const cascaderProps = { value: "id", label: "name", emitPath: false };
const treeSelectProps = { value: "id", label: "name", emitPath: false };

interface DrawerProps {
  title: string;
  isView: boolean;
  rowData?: Footprint.ResGetFootprintRecord;
  apiUrl?: (params: any) => Promise<any>;
  updateTable?: () => Promise<any>;
}

// drawer frame status
const drawerVisible = ref(false);
const drawerData = ref<DrawerProps>({
  isView: false,
  title: ""
});

// Parameters transmitted from the parent footprint
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
      ElMessage.success({ message: `${drawerData.value.title} footprint success!` });
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

const footprintCategories = ref();

const refreshFootprintCategories = () =>
  getFootprintCategoryEnumTree().then(res => {
    if (res) footprintCategories.value = res;
  });

// When opening the drawer, fetch the necessary field values
watch(drawerVisible, openValue => {
  if (openValue) {
    refreshFootprintCategories();
  }
});

// Open the drawer (new, view, edit)
interface DrawerExpose {
  acceptParams: (params: any) => void;
}

const drawerRefFootprintCategory = ref<DrawerExpose>();
const openNestedFootprintCategoryDrawer = (
  title: string,
  rowData: Partial<FootprintCategory.ResGetFootprintCategoryRecord> = {}
) => {
  let params = {
    title,
    rowData: { ...rowData },
    isView: title === "View",
    apiUrl: title === "New" ? postFootprintCategoryCreate : "",
    updateTable: refreshFootprintCategories
  };
  // actually open drawer
  drawerRefFootprintCategory.value!.acceptParams(params);
};

defineExpose({
  acceptParams
});
</script>
