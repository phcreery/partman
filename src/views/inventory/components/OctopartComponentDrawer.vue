<template>
	<div>
		<el-drawer v-model="drawerVisible" :destroy-on-close="true" size="600px" :title="`${drawerData.title} Octopart Component`">
			<el-form
				ref="ruleFormRef"
				:rules="rules"
				:disabled="drawerData.isView"
				:model="drawerData.rowData"
				label-width="80px"
				label-suffix=" :"
				:append-to-body="true"
			>
				<el-form-item label="MPN" prop="mpn">
					<div class="form-item-with-buttons">
						<el-space>
							<el-input v-model="drawerData.rowData!.mpn" placeholder="Please fill in the component name" clearable></el-input>
							<el-button :icon="Search" @click="searchOctopart" />
						</el-space>
					</div>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="drawerVisible = false">Cancel</el-button>
				<!-- <el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">Save</el-button> -->
			</template>
			<el-table :data="searchResults" :border="true" style="width: 100%">
				<el-table-column type="expand">
					<template #default="props">
						<div style="margin: 4%">
							<el-descriptions title="Summary" :column="1" border direction="vertical">
								<template #extra>
									<el-button type="primary" @click="handleSubmit(props.row.part)">Import</el-button>
								</template>
								<el-descriptions-item>
									<template #label>
										<div>Description</div>
									</template>
									{{ props.row.part.shortDescription }}
								</el-descriptions-item>
								<el-descriptions-item v-if="props.row.part.category">
									<template #label>
										<div>Category</div>
									</template>
									{{ props.row.part.category.name }} ({{ props.row.part.category.path }})
								</el-descriptions-item>
							</el-descriptions>

							<h3>Attributes</h3>
							<el-table :data="props.row.part.specs" :border="true">
								<el-table-column label="Attribute" prop="attribute.name" />
								<el-table-column label="Value" prop="displayValue" />
							</el-table>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="MPN" prop="part.mpn" width="140" />
				<el-table-column label="Description" prop="part.shortDescription" />
				<!-- <el-table-column fixed="right" label="" width="80">
					<template #default>
						<el-button link type="primary" size="small">Import</el-button>
					</template>
				</el-table-column> -->
			</el-table>
			<!-- {{ searchResults }} -->
		</el-drawer>
	</div>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, Ref, reactive, watch } from "vue";
// import { genderType } from "@/utils/serviceDict";
import { Component } from "@/api/interface";
// import { getFootprintsEnum, getComponentStorageLocationEnum, getComponentCategoryEnumTree } from "@/api/modules/components";
import { ElMessage, FormInstance } from "element-plus";
// import UploadImg from "@/components/UploadImg/index.vue";
import { Search } from "@element-plus/icons-vue";
import { getPartListByMPN } from "@/api/modules/octopart";
import { SupPartResultSet, SupPart } from "@/api/interface/octopart";

const rules = reactive({
	mpn: [{ required: true, message: "Please input the MPN", trigger: "change" }]
});

interface DrawerProps {
	title: string;
	isView: boolean;
	rowData?: Component.ResGetComponentRecord;
	apiUrl?: (params: any) => Promise<any>;
	updateTable?: (component: Partial<Component.ResGetComponentRecord>) => Promise<any>;
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
	searchResults.value = [];
	// Don't search if initial MPN form item is empty
	// if (params.rowData?.mpn && params.rowData?.mpn !== "")
	searchOctopart();
};

const ruleFormRef = ref<FormInstance>();
// Submit data (new/edit)
const handleSubmit = (part: SupPart) => {
	console.log("submitting", part, drawerData.value.rowData);
	ruleFormRef.value!.validate(async valid => {
		if (!valid) return;
		try {
			// await drawerData.value.apiUrl!(drawerData.value.rowData);
			// ElMessage.success({ message: `${drawerData.value.title} component success!` });
			let component: Partial<Component.ResGetComponentRecord> = {
				mpn: part.mpn,
				manufacturer: part.manufacturer.name,
				specs: part.specs,
				description: part.shortDescription
			};
			// component.ipn = part.value.mpn;
			// component.manufacturer = part.value.manufacturer.name;
			// component.specs = part.value.specs;
			// component.description = part.value.shortDescription;
			drawerData.value.updateTable!(component);
			drawerVisible.value = false;
		} catch (error) {
			console.log(error);
			ElMessage.error(String(error));
		}
	});
};

const searchResults: Ref<SupPartResultSet["results"]> = ref([]);
const searchOctopart = async () => {
	searchResults.value = (await getPartListByMPN(drawerData.value.rowData?.mpn || "")).results;
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
