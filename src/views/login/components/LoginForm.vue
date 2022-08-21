<template>
	<el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
		<el-form-item prop="username">
			<el-input v-model="loginForm.username" placeholder="Email">
				<template #prefix>
					<el-icon class="el-input__icon"><user /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item prop="password">
			<el-input type="password" v-model="loginForm.password" placeholder="Password" show-password autocomplete="new-password">
				<template #prefix>
					<el-icon class="el-input__icon"><lock /></el-icon>
				</template>
			</el-input>
		</el-form-item>
	</el-form>
	<div class="login-btn">
		<el-button :icon="CircleClose" round @click="resetForm(loginFormRef)" size="large">Reset</el-button>
		<el-button :icon="UserFilled" round @click="login(loginFormRef)" size="large" type="primary" :loading="loading">
			Log in
		</el-button>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Login } from "@/api/interface";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";
import { ElMessage } from "element-plus";
import { loginApi } from "@/api/modules/login";
import { GlobalStore } from "@/store";
import { MenuStore } from "@/store/modules/menu";
import { TabsStore } from "@/store/modules/tabs";
// import md5 from "js-md5";

const globalStore = GlobalStore();
const menuStore = MenuStore();
const tabStore = TabsStore();

// Define Form ref (verification rules)
type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
	username: [{ required: true, message: "Please enter user name", trigger: "blur" }],
	password: [{ required: true, message: "Please enter the password", trigger: "blur" }]
});

// Login form data
const loginForm = reactive<Login.ReqLoginParams>({
	username: "",
	password: ""
});

const loading = ref<boolean>(false);
const router = useRouter();
// login
const login = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async valid => {
		if (!valid) return;
		loading.value = true;
		try {
			const requestLoginForm: Login.ReqLoginParams = {
				username: loginForm.username,
				password: loginForm.password // md5(loginForm.password)
			};
			const res = await loginApi(requestLoginForm);
			// * Store token
			// globalStore.setToken(res.data!.access_token);
			globalStore.setToken(res.token);
			globalStore.setUserInfo(res.user);
			// * After the login is successful, remove the Menulist and TABS data of the previous account
			menuStore.setMenuList([]);
			tabStore.closeMultipleTab();

			ElMessage.success("Login successful!");
			router.push({ name: "home" });
		} finally {
			loading.value = false;
		}
	});
};

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
};

onMounted(() => {
	// Surveillance ENTER event (call login)
	document.onkeydown = (e: any) => {
		e = window.event || e;
		if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
			if (loading.value) return;
			login(loginFormRef.value);
		}
	};
});
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
