<template>
	<el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerData.title} Component Category`">
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
			<el-form-item label="Parent" prop="parent" v-loading="componentCategories === undefined">
				<!-- <el-select v-model="drawerData.rowData!.category" placeholder="" clearable>
					<el-option v-for="item in componentCategories" :key="item.id" :label="item.name" :value="item.id" />
				</el-select> -->
				<!-- <el-cascader v-model="drawerData.rowData!.category" :options="componentCategories" :props="cascaderProps" /> -->
				<el-tree-select
					v-model="drawerData.rowData!.parent"
					:multiple="false"
					:data="componentCategories"
					:props="treeSelectProps"
					clearable
					:render-after-expand="false"
					:checkStrictly="true"
					value-key="id"
				/>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="drawerVisible = false">Cancel</el-button>
			<el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">Save</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive, watch } from "vue";
// import { genderType } from "@/utils/serviceDict";
import { ComponentCategory } from "@/api/interface";
import { getComponentCategoryEnumTree } from "@/api/modules/components";
import { ElMessage, FormInstance } from "element-plus";

interface DrawerProps {
	title: string;
	isView: boolean;
	rowData?: ComponentCategory.ResGetComponentCategoryRecord;
	apiUrl?: (params: any) => Promise<any>;
	updateTable?: () => Promise<any>;
}

// Parameters transmitted from the parent component
const acceptParams = (params: DrawerProps): void => {
	console.log("params", params);
	drawerData.value = params;
	drawerVisible.value = true;
};

const rules = reactive({
	name: [{ required: true, message: "Please upload the component name", trigger: "change" }],
	description: [{ required: false, message: "Please fill in the description", trigger: "change" }],
	parent: [{ required: true, message: "Please select parent", trigger: "change" }]
});

// const cascaderProps = { value: "id", label: "name", emitPath: false };
const treeSelectProps = { value: "id", label: "name", emitPath: false };

// drawer frame status
const drawerVisible = ref(false);
const drawerData = ref<DrawerProps>({
	isView: false,
	title: ""
});

const ruleFormRef = ref<FormInstance>();
// Submit data (new/edit)
const handleSubmit = () => {
	ruleFormRef.value!.validate(async valid => {
		console.log("submit", valid, ruleFormRef.value, componentCategories.value, drawerData.value.rowData!);
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
// const checkValidate = (val: string) => {
// 	ruleFormRef.value!.validateField(val, () => {});
// };

const componentCategories = ref();

// When opening the drawer, fetch the necessary field values
watch(drawerVisible, openValue => {
	if (openValue) {
		getComponentCategoryEnumTree().then(res => {
			if (res) componentCategories.value = res.data;
		});
	}
});

defineExpose({
	acceptParams
});
</script>
