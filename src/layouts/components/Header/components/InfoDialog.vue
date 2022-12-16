<template>
	<el-dialog v-model="dialogVisible" title="Personal Information" width="500px" draggable>
		<span>This is userInfo</span>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">Cancellation</el-button>
				<el-button type="primary" @click="dialogVisible = false">Confirmation</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
const dialogVisible = ref(false);

// openDialog
const openDialog = () => {
	dialogVisible.value = true;
};

defineExpose({ openDialog });
</script>
