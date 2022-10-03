<template>
	<div>
		<el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerData.title} Project Component`">
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
				<el-form-item label="MPN" prop="id" v-loading="components === undefined">
					<!-- <el-input
						v-model="drawerData.rowData!.mpn"
						placeholder="Please fill in the component"
						clearable
						:rows="4"
						type="textarea"
						autosize
					>
					</el-input> -->
					<div class="form-item-with-buttons">
						<el-space>
							<el-select v-model="drawerData.rowData!.id" placeholder="" clearable filterable style="width: max-content">
								<el-option v-for="item in components" :key="item.id" :label="item.mpn" :value="item.id">
									<span style="float: left">{{ item.mpn }}</span>
									<span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">{{
										trimEllip(item.description, 25)
									}}</span>
								</el-option>
							</el-select>
							<el-button-group>
								<el-button :icon="Refresh" @click="refreshComponents" />
								<el-button :icon="Plus" @click="openCreateComponentDrawer('New')" />
							</el-button-group>
						</el-space>
					</div>
				</el-form-item>
				<el-form-item label="Quantity" prop="_quantity_used">
					<el-input-number v-model="drawerData.rowData!._quantity_used" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="drawerVisible = false">Cancel</el-button>
				<el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">Save</el-button>
			</template>
		</el-drawer>

		<ComponentDrawer ref="drawerRefCreateComponent"></ComponentDrawer>
	</div>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive, watch } from "vue";
import { Refresh, Plus } from "@element-plus/icons-vue";
import { ElMessage, FormInstance } from "element-plus";
// import { genderType } from "@/utils/serviceDict";
import { Project, Component } from "@/api/interface";
// import UploadImg from "@/components/UploadImg/index.vue";
import { getComponentEnum, postComponentCreate, patchComponentUpdate } from "@/api/modules/components";
import ComponentDrawer from "@/views/inventory/components/ComponentDrawer.vue";

const rules = reactive({
	name: [{ required: true, message: "Please enter the project name", trigger: "change" }],
	description: [{ required: false, message: "Please enter project description", trigger: "change" }]
});

// const cascaderProps = { value: "id", label: "name", emitPath: false };
// const treeSelectProps = { value: "id", label: "name", emitPath: false };

interface DrawerProps {
	title: string;
	isView: boolean;
	rowData?: Project.ResGetProjectComponentRecord;
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
			ElMessage.success({ message: `${drawerData.value.title} project success!` });
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

// TreeSelect search function
// const filterNodeMethod = (value: string, data: Project.ResGetProjectComponentRecord) => {
// 	return data.name.toLowerCase().includes(value.toLowerCase());
// };

const trimEllip = (string: string, length: number) => {
	return string.length > length ? string.substring(0, length) + "..." : this;
};

const components = ref<Component.ResGetComponentRecord[]>();

const refreshComponents = () => getComponentEnum().then(res => (components.value = res.data));

// When opening the drawer, fetch the necessary field values
watch(drawerVisible, openValue => {
	if (openValue) {
		refreshComponents();
	}
});

// Open the drawer (new, view, edit)
interface DrawerExpose {
	acceptParams: (params: any) => void;
}
const drawerRefCreateComponent = ref<DrawerExpose>();
const openCreateComponentDrawer = (title: string, rowData: Partial<Component.ResGetComponentRecord> = {}) => {
	let params = {
		title,
		rowData: { ...rowData },
		isView: title === "View",
		apiUrl:
			title === "New"
				? postComponentCreate
				: title === "Edit"
				? patchComponentUpdate
				: title === "Stock"
				? patchComponentUpdate
				: "",
		updateTable: refreshComponents
	};
	drawerRefCreateComponent.value!.acceptParams(params);
};

defineExpose({
	acceptParams
});
</script>

<style lang="scss"></style>
