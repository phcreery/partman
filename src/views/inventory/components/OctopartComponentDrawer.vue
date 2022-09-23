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
				<el-form-item label="Name" prop="name">
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
				<el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">Save</el-button>
			</template>
			<el-table :data="searchResults" :border="true" style="width: 100%">
				<el-table-column type="expand">
					<template #default="props">
						<div style="margin: 4%">
							<el-descriptions title="Summary" :column="1" border direction="vertical">
								<template #extra>
									<el-button type="primary">Import</el-button>
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
import { ref, reactive, watch } from "vue";
// import { genderType } from "@/utils/serviceDict";
import { Component, ComponentCategory, Footprint, Storage } from "@/api/interface";
import { getFootprintsEnum, getComponentStorageLocationEnum, getComponentCategoryEnumTree } from "@/api/modules/components";
import { ElMessage, FormInstance } from "element-plus";
// import UploadImg from "@/components/UploadImg/index.vue";
import { Search } from "@element-plus/icons-vue";
import { Query, supSearchMpn } from "@/api/interface/octopart";
import { getPartListByMPN } from "@/api/modules/octopart";

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
	searchResults.value = [];
	// Don't search if initial MPN form item is empty
	if (params.rowData?.mpn && params.rowData?.mpn !== "") searchOctopart();
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

const searchResults: supSearchMpn.searchResults = ref([]);
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
