<template>
	<el-dropdown trigger="click">
		<div class="avatar isicon">
			<!-- <img src="@/assets/images/avatar.gif" alt="avatar" /> -->
			<el-icon><Avatar /></el-icon>
		</div>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item @click="openDialog('infoRef')">{{ $t("header.personalData") }}</el-dropdown-item>
				<el-dropdown-item @click="openDialog('passwordRef')">{{ $t("header.changePassword") }}</el-dropdown-item>
				<el-dropdown-item @click="logout" divided>{{ $t("header.logout") }}</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
	<!-- infoDialog -->
	<InfoDialog ref="infoRef"></InfoDialog>
	<!-- passwordDialog -->
	<PasswordDialog ref="passwordRef"></PasswordDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import InfoDialog from "./InfoDialog.vue";
import PasswordDialog from "./PasswordDialog.vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { GlobalStore } from "@/store";

const router = useRouter();
const globalStore = GlobalStore();

// sign out
const logout = () => {
	ElMessageBox.confirm("Are you sure you want to sign out? You will have to log back in.", "Are you sure?", {
		confirmButtonText: "Yes",
		cancelButtonText: "Cancel",
		type: "warning"
	}).then(() => {
		router.push({ name: "login" });
		globalStore.setToken("");
		globalStore.setUserInfo(null);
		ElMessage({
			type: "success",
			message: "Logged out"
		});
	});
};

interface DialogExpose {
	openDialog: () => void;
}
const infoRef = ref<null | DialogExpose>(null);
const passwordRef = ref<null | DialogExpose>(null);
// Open the modification password and personal information pop -up window
const openDialog = (refName: string) => {
	if (refName == "infoRef") return infoRef.value?.openDialog();
	passwordRef.value?.openDialog();
};
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
