<template>
	<div>
		<el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerData.title} Octopart Component`">
			<el-form
				ref="ruleFormRef"
				:rules="rules"
				:disabled="drawerData.isView"
				:model="drawerData.rowData"
				label-width="130px"
				label-suffix=" :"
				:append-to-body="true"
			>
				<el-form-item label="Name" prop="name">
					<div class="form-item-with-buttons">
						<el-space>
							<el-input v-model="drawerData.rowData!.name" placeholder="Please fill in the component name" clearable></el-input>
							<el-button :icon="Search" @click="searchOctopart" />
						</el-space>
					</div>
				</el-form-item>
				<!-- <el-form-item label="Description" prop="description">
					<el-input
						v-model="drawerData.rowData!.description"
						placeholder="Please fill in the component description"
						clearable
						:rows="4"
						type="textarea"
						autosize
					></el-input>
				</el-form-item> -->
				<!-- <el-form-item label="Footprint" prop="footprint" v-loading="componentFootprints === undefined">
					<el-select v-model="drawerData.rowData!.footprint" placeholder="" clearable filterable style="width: max-content">
						<el-option v-for="item in componentFootprints" :key="item.id" :label="item.name" :value="item.id" />
					</el-select>
				</el-form-item> -->
				<!-- <el-form-item label="IPN" prop="ipn">
					<el-input v-model="drawerData.rowData!.ipn" placeholder="Internal Part Number" clearable></el-input>
				</el-form-item> -->
			</el-form>
			<template #footer>
				<el-button @click="drawerVisible = false">Cancel</el-button>
				<el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">Save</el-button>
			</template>
			{{ searchResults }}
		</el-drawer>
	</div>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive, watch } from "vue";
// import { genderType } from "@/utils/serviceDict";
import { Component, ComponentCategory, Footprint, Storage } from "@/api/interface";
import { getFootprintsEnum, getComponentStorageLocationEnum, getComponentCategoryEnumTree } from "@/api/modules/components";
import { ElMessage, FormInstance } from "element-plus";
// import UploadImg from "@/components/UploadImg/index.vue";
import { Refresh, Plus, Search } from "@element-plus/icons-vue";

import { getNewToken, graphql, getPartListByMPN } from "@/api/modules/octopart";

const rules = reactive({
	name: [{ required: true, message: "Please upload the component name", trigger: "change" }],
	footprint: [{ required: false, message: "Please fill in the footprint", trigger: "change" }],
	stock: [{ required: true, message: "Please fill in the stock qty", trigger: "change" }],
	storage_location: [{ required: false, message: "Please select location", trigger: "change" }],
	category: [{ required: true, message: "Please select category", trigger: "change" }],
	ipn: [{ required: false, message: "Please fill in IPN", trigger: "change" }]
});

interface DrawerProps {
	title: string;
	isView: boolean;
	rowData?: Component.ResGetComponentRecord;
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
			ElMessage.success({ message: `${drawerData.value.title} component success!` });
			drawerData.value.updateTable!();
			drawerVisible.value = false;
		} catch (error) {
			console.log(error);
		}
	});
};

const searchResults = ref();
const searchOctopart = async () => {
	searchResults.value = await getPartListByMPN(drawerData.value.rowData?.name || "");
};

// Public verification method (the picture upload successfully triggers re -verification)
// const checkValidate = (val: string) => {
// 	ruleFormRef.value!.validateField(val, () => {});
// };

// When opening the drawer, fetch the necessary field values
watch(drawerVisible, openValue => {
	if (openValue) {
	}
});

defineExpose({
	acceptParams
});
</script>

<style lang="scss"></style>
