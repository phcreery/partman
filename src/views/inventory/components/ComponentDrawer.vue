<template>
	<el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerData.title} Component`">
		<el-form
			ref="ruleFormRef"
			:rules="rules"
			:disabled="drawerData.isView"
			:model="drawerData.rowData"
			label-width="130px"
			label-suffix=" :"
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
				<el-input v-model="drawerData.rowData!.name" placeholder="Please fill in the component name" clearable></el-input>
			</el-form-item>
			<el-form-item label="Description" prop="description">
				<el-input
					v-model="drawerData.rowData!.description"
					placeholder="Please fill in the component description"
					clearable
					:rows="4"
					type="textarea"
					autosize
				></el-input>
			</el-form-item>
			<el-form-item label="Footprint" prop="footprint" v-loading="componentFootprints === undefined">
				<div class="form-with-buttons">
					<el-space>
						<el-select v-model="drawerData.rowData!.footprint" placeholder="" clearable filterable style="width: max-content">
							<el-option v-for="item in componentFootprints" :key="item.id" :label="item.name" :value="item.id" />
						</el-select>
						<el-button-group>
							<el-button :icon="Refresh" @click="refreshCategories" />
							<el-button :icon="Plus" />
						</el-button-group>
					</el-space>
				</div>
			</el-form-item>
			<el-form-item label="Stock" prop="stock">
				<el-input-number v-model="drawerData.rowData!.stock" />
			</el-form-item>
			<el-form-item label="Storage Location" prop="storage_location" v-loading="componentStorageLocations === undefined">
				<div class="form-with-buttons">
					<el-space>
						<el-select v-model="drawerData.rowData!.storage_location" placeholder="" clearable filterable>
							<el-option v-for="item in componentStorageLocations" :key="item.id" :label="item.name" :value="item.id" />
						</el-select>
						<el-button-group>
							<el-button :icon="Refresh" @click="refreshStorageLocations" />
							<el-button :icon="Plus" />
						</el-button-group>
					</el-space>
				</div>
			</el-form-item>
			<el-form-item label="Category" prop="category" v-loading="componentCategories === undefined">
				<div class="form-with-buttons">
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
							<el-button :icon="Refresh" @click="refreshFootprints" />
							<el-button :icon="Plus" />
						</el-button-group>
					</el-space>
				</div>
			</el-form-item>
			<el-form-item label="IPN" prop="ipn">
				<el-input v-model="drawerData.rowData!.ipn" placeholder="Internal Part Number" clearable></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="drawerVisible = false">Cancel</el-button>
			<el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">Save</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive, onMounted, watch } from "vue";
// import { genderType } from "@/utils/serviceDict";
import { ResList, Component, Category, Footprint, Storage } from "@/api/interface";
import { getFootprintsEnum, getComponentStorageLocationEnum, getComponentCategoryEnumTree } from "@/api/modules/components";
import { ElMessage, FormInstance } from "element-plus";
import UploadImg from "@/components/UploadImg/index.vue";
import { CirclePlus, Delete, EditPen, Download, Upload, View, Refresh, DCaret, Plus } from "@element-plus/icons-vue";

const rules = reactive({
	name: [{ required: true, message: "Please upload the component name", trigger: "change" }],
	footprint: [{ required: false, message: "Please fill in the footprint", trigger: "change" }],
	stock: [{ required: true, message: "Please fill in the stock qty", trigger: "change" }],
	storage_location: [{ required: false, message: "Please select location", trigger: "change" }],
	category: [{ required: true, message: "Please select category", trigger: "change" }],
	ipn: [{ required: false, message: "Please fill in IPN", trigger: "change" }]
});

const cascaderProps = { value: "id", label: "name", emitPath: false };
const treeSelectProps = { value: "id", label: "name", emitPath: false };

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

// Public verification method (the picture upload successfully triggers re -verification)
const checkValidate = (val: string) => {
	ruleFormRef.value!.validateField(val, () => {});
};

const filterNodeMethod = (value: string, data: Category.ResGetCategoryRecord) => {
	return data.name.toLowerCase().includes(value.toLowerCase());
};

const componentCategories = ref<Category.ResGetCategoryRecord[]>();
const componentStorageLocations = ref<Storage.ResGetStorageRecord[]>();
const componentFootprints = ref<Footprint.ResGetFootprintRecord[]>();

const refreshCategories = () => getComponentCategoryEnumTree().then(res => (componentCategories.value = res.data));
const refreshStorageLocations = () => getComponentStorageLocationEnum().then(res => (componentStorageLocations.value = res.data));
const refreshFootprints = () => getFootprintsEnum().then(res => (componentFootprints.value = res.data));

// When opening the drawer, fetch the necessary field values
watch(drawerVisible, openValue => {
	if (openValue) {
		refreshCategories();
		refreshStorageLocations();
		refreshFootprints();
	}
});

defineExpose({
	acceptParams
});
</script>

<style lang="scss">
.form-with-buttons {
	width: 100%;
	.el-space {
		width: 100%;
		.el-space__item {
			&:first-child {
				width: 100%;
			}
			&:last-child {
				margin-right: 0px !important;
			}
			& > .el-button-group {
				width: max-content;
			}
		}
	}
}
</style>
