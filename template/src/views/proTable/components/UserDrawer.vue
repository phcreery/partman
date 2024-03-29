<template>
	<el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}用户`">
		<el-form
			ref="ruleFormRef"
			label-width="100px"
			label-suffix=" :"
			:rules="rules"
			:disabled="drawerProps.isView"
			:model="drawerProps.rowData"
			:hide-required-asterisk="drawerProps.isView"
		>
			<el-form-item label="用户头像" prop="avatar">
				<UploadImg v-model:imageUrl="drawerProps.rowData!.avatar" width="135px" height="135px" :file-size="3">
					<template #empty>
						<el-icon><Avatar /></el-icon>
						<span>请上传头像</span>
					</template>
					<template #tip> 头像大小不能超过 3M </template>
				</UploadImg>
			</el-form-item>
			<el-form-item label="用户照片" prop="photo">
				<UploadImgs v-model:fileList="drawerProps.rowData!.photo" height="140px" width="140px" border-radius="50%">
					<template #empty>
						<el-icon><Picture /></el-icon>
						<span>请上传照片</span>
					</template>
					<template #tip> 照片大小不能超过 5M </template>
				</UploadImgs>
			</el-form-item>
			<el-form-item label="用户姓名" prop="username">
				<el-input v-model="drawerProps.rowData!.username" placeholder="请填写用户姓名" clearable></el-input>
			</el-form-item>
			<el-form-item label="性别" prop="gender">
				<el-select v-model="drawerProps.rowData!.gender" placeholder="请选择性别" clearable>
					<el-option v-for="item in genderType" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="身份证号" prop="idCard">
				<el-input v-model="drawerProps.rowData!.idCard" placeholder="请填写身份证号" clearable></el-input>
			</el-form-item>
			<el-form-item label="邮箱" prop="email">
				<el-input v-model="drawerProps.rowData!.email" placeholder="请填写邮箱" clearable></el-input>
			</el-form-item>
			<el-form-item label="居住地址" prop="address">
				<el-input v-model="drawerProps.rowData!.address" placeholder="请填写居住地址" clearable></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="drawerVisible = false">取消</el-button>
			<el-button type="primary" v-show="!drawerProps.isView" @click="handleSubmit">确定</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts" name="UserDrawer">
import { ref, reactive } from "vue";
import { genderType } from "@/utils/serviceDict";
import { ElMessage, FormInstance } from "element-plus";
import UploadImg from "@/components/Upload/Img.vue";
import UploadImgs from "@/components/Upload/Imgs.vue";

const rules = reactive({
	avatar: [{ required: true, message: "请上传用户头像", trigger: "change" }],
	photo: [{ required: true, message: "请上传用户照片", trigger: "change" }],
	username: [{ required: true, message: "请填写用户姓名", trigger: "change" }],
	gender: [{ required: true, message: "请选择性别", trigger: "change" }],
	idCard: [{ required: true, message: "请填写身份证号", trigger: "change" }],
	email: [{ required: true, message: "请填写邮箱", trigger: "change" }],
	address: [{ required: true, message: "请填写居住地址", trigger: "change" }]
});

interface DrawerProps {
	title: string;
	isView: boolean;
	rowData?: any;
	api?: (params: any) => Promise<any>;
	getTableList?: () => Promise<any>;
}

// drawer框状态
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
	isView: false,
	title: ""
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps): void => {
	drawerProps.value = params;
	drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
	ruleFormRef.value!.validate(async valid => {
		if (!valid) return;
		try {
			await drawerProps.value.api!(drawerProps.value.rowData);
			ElMessage.success({ message: `${drawerProps.value.title}用户成功！` });
			drawerProps.value.getTableList!();
			drawerVisible.value = false;
		} catch (error) {
			console.log(error);
		}
	});
};

defineExpose({
	acceptParams
});
</script>
