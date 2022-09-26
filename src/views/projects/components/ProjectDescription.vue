<template>
	<div style="margin: 2%">
		<el-table :data="props.components" :border="true" style="width: 100%">
			<el-table-column label="ID" prop="id" width="140" />
			<el-table-column label="MPN" prop="mpn" />
			<!-- <el-table-column fixed="right" label="" width="80">
					<template #default>
						<el-button link type="primary" size="small">Import</el-button>
					</template>
				</el-table-column> -->
		</el-table>
	</div>
</template>

<script setup lang="ts" name="ProjectDescription">
import { ref, reactive, watch } from "vue";
import { Refresh, Plus, Search, Delete } from "@element-plus/icons-vue";
import { ElMessage, FormInstance } from "element-plus";
import { Project, Component } from "@/api/interface";

interface DescriptionProps {
	title: string;
	components?: Component.ResGetComponentRecord[];
	quantity?: { [key: string]: number };
	updateTable?: () => Promise<any>;
}

// Accept the parent component parameter, configure the default value
const props = withDefaults(defineProps<DescriptionProps>(), {
	title: ""
	// components: [],
	// quantity: {}
});

// drawer frame status
const drawerVisible = ref(false);
// const drawerData = ref<DescriptionProps>({
// 	title: ""
// });

// // Parameters transmitted from the parent component
// const acceptParams = (params: DescriptionProps): void => {
// 	drawerData.value = params;
// 	drawerVisible.value = true;
// };

// When opening the drawer, fetch the necessary field values
watch(drawerVisible, openValue => {
	if (openValue) {
	}
});

defineExpose({
	// acceptParams
});
</script>

<style lang="scss"></style>
