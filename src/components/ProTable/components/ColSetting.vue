<template>
	<!-- Column display settings -->
	<el-drawer title="Column settings" v-model="drawerVisible" size="400px">
		<div class="table-box">
			<el-table height="575" :data="colSetting" :border="true">
				<el-table-column prop="label" label="Column" :align="'center'" />
				<el-table-column prop="name" label="Visibility" v-slot="scope" :align="'center'">
					<el-switch v-model="scope.row.isShow" @click="switchShow"></el-switch>
				</el-table-column>
				<template #empty>
					<div class="table-empty">
						<img src="@/assets/images/notData.png" alt="notData" />
						<div>No data</div>
					</div>
				</template>
			</el-table>
		</div>
	</el-drawer>
</template>

<script setup lang="ts" name="colSetting">
import { ref, nextTick } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";

const props = defineProps<{ colSetting: Partial<ColumnProps>[]; tableRef: any }>();

const drawerVisible = ref<boolean>(false);
// Open the column settings
const openColSetting = (): void => {
	drawerVisible.value = true;
};

// Re -layout when the hidden hidden time Table (Prevent table shake,After hidden display, horizontal scroll bar will appear,element-plus Internal questions have been raised issues）
const switchShow = () => {
	nextTick(() => {
		props.tableRef.doLayout();
	});
};

defineExpose({
	openColSetting
});
</script>
