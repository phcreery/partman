<template>
	<div>
		<el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerData.title} Storage Location`">
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
					<el-input v-model="drawerData.rowData!.name" placeholder="Please fill in the storage name" clearable></el-input>
				</el-form-item>
				<el-form-item label="Description" prop="description">
					<el-input
						v-model="drawerData.rowData!.description"
						placeholder="Please fill in the storage description"
						clearable
						:rows="4"
						type="textarea"
						autosize
					></el-input>
				</el-form-item>
				<el-form-item label="Category" prop="category" v-loading="storageCategories === undefined">
					<!-- <el-select v-model="drawerData.rowData!.category" placeholder="" clearable>
					<el-option v-for="item in storageCategories" :key="item.id" :label="item.name" :value="item.id" />
				</el-select> -->
					<!-- <el-cascader v-model="drawerData.rowData!.category" :options="storageCategories" :props="cascaderProps" /> -->
					<!-- <el-tree-select
						v-model="drawerData.rowData!.category"
						:multiple="false"
						:data="storageCategories"
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
								:data="storageCategories"
								:props="treeSelectProps"
								clearable
								:render-after-expand="false"
								:checkStrictly="true"
							/>
							<el-button-group>
								<el-button :icon="Refresh" @click="refreshStorageCategories" />
								<el-button :icon="Plus" @click="openNestedStorageCategoryDrawer('New')" />
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

		<StorageCategoryDrawer ref="drawerRefStorageCategory"></StorageCategoryDrawer>
	</div>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive, watch } from "vue";
// import { genderType } from "@/utils/serviceDict";
import { Storage, StorageCategory } from "@/api/interface";
import { getStorageCategoryEnumTree, postStorageCategoryCreate } from "@/api/modules/components";
import { ElMessage, FormInstance } from "element-plus";
// import UploadImg from "@/components/UploadImg/index.vue";
import { Refresh, Plus } from "@element-plus/icons-vue";
import StorageCategoryDrawer from "@/views/storage/components/StorageCategoryDrawer.vue";

const rules = reactive({
	name: [{ required: true, message: "Please upload the storage name", trigger: "change" }],
	description: [{ required: false, message: "Please fill in the description", trigger: "change" }],
	category: [{ required: false, message: "Please select category", trigger: "change" }]
});

// const cascaderProps = { value: "id", label: "name", emitPath: false };
const treeSelectProps = { value: "id", label: "name", emitPath: false };

interface DrawerProps {
	title: string;
	isView: boolean;
	rowData?: Storage.ResGetStorageRecord;
	apiUrl?: (params: any) => Promise<any>;
	updateTable?: () => Promise<any>;
}

// drawer frame status
const drawerVisible = ref(false);
const drawerData = ref<DrawerProps>({
	isView: false,
	title: ""
});

// Parameters transmitted from the parent storage
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
			ElMessage.success({ message: `${drawerData.value.title} storage success!` });
			drawerData.value.updateTable!();
			drawerVisible.value = false;
		} catch (error) {
			console.log(error);
		}
	});
};

// Public verification method (the picture upload successfully triggers re -verification)
// const checkValidate = (val: string) => {
// 	ruleFormRef.value!.validateField(val, () => {});
// };

const storageCategories = ref();

const refreshStorageCategories = () =>
	getStorageCategoryEnumTree().then(res => {
		if (res) storageCategories.value = res.data;
	});

// When opening the drawer, fetch the necessary field values
watch(drawerVisible, openValue => {
	if (openValue) {
		refreshStorageCategories();
	}
});

// Open the drawer (new, view, edit)
interface DrawerExpose {
	acceptParams: (params: any) => void;
}

const drawerRefStorageCategory = ref<DrawerExpose>();
const openNestedStorageCategoryDrawer = (title: string, rowData: Partial<StorageCategory.ResGetStorageCategoryRecord> = {}) => {
	let params = {
		title,
		rowData: { ...rowData },
		isView: title === "View",
		apiUrl: title === "New" ? postStorageCategoryCreate : "",
		updateTable: refreshStorageCategories
	};
	// actually open drawer
	drawerRefStorageCategory.value!.acceptParams(params);
};

defineExpose({
	acceptParams
});
</script>
