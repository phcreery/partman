<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="Username/Email">
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
    <!-- <el-button :icon="Key" round @click="login(loginFormRef, true)" size="large" :loading="loading"> Admin Login </el-button> -->
    <el-button :icon="UserFilled" round @click="login(loginFormRef)" size="large" type="primary" :loading="loading">
      Login
    </el-button>
  </div>
</template>

<!-- <script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Login } from "@/api/interface";
import { CircleClose, UserFilled, Key } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";
import { ElMessage } from "element-plus";
import { loginApi, loginApiAsAdmin } from "@/api/modules/login";
import { GlobalStore } from "@/stores";
import { MenuStore } from "@/stores/modules/menu";
import { TabsStore } from "@/stores/modules/tabs";
// import md5 from "js-md5";

const globalStore = GlobalStore();
const menuStore = MenuStore();
const tabStore = TabsStore();

// Define Form ref (verification rules)
type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  username: [{ required: true, message: "Please enter user name", trigger: "blur" }],
  password: [{ required: true, message: "Please enter your password", trigger: "blur" }]
});

// Login form data
const loginForm = reactive<Login.ReqLoginParams>({
  username: "",
  password: ""
});

const loading = ref<boolean>(false);
const router = useRouter();
// login
const login = (formEl: FormInstance | undefined, asAdmin: boolean) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      const requestLoginForm: Login.ReqLoginParams = {
        username: loginForm.username,
        password: loginForm.password // md5(loginForm.password)
      };
      // const res = asAdmin ? await loginApiAsAdmin(requestLoginForm) : await loginApi(requestLoginForm);
      const res = await loginApi(requestLoginForm);

      // * Store token
      // globalStore.setToken(res.data!.access_token);
      globalStore.setToken(res.token);
      globalStore.setUserInfo(res.record);
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
      login(loginFormRef.value, false);
    }
  };
});
</script>

<style scoped lang="scss">
@import "../index.scss";
</style> -->

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Login } from "@/api/interface";
import { ElNotification } from "element-plus";
import { loginApi } from "@/api/modules/login";
import { GlobalStore } from "@/stores";
import { TabsStore } from "@/stores/modules/tabs";
import { getTimeState } from "@/utils/util";
import { HOME_URL } from "@/config/config";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";
import md5 from "js-md5";

const router = useRouter();
const tabsStore = TabsStore();
const globalStore = GlobalStore();
// 定义 formRef（校验规则）
type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});
const loading = ref(false);
const loginForm = reactive<Login.ReqLoginParams>({ username: "", password: "" });
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      // 1.执行登录接口
      // const { data } = await loginApi({ ...loginForm, password: md5(loginForm.password) });
      const { data } = await loginApi(loginForm);
      // globalStore.setToken(data.access_token);
      globalStore.setToken(data.token);
      globalStore.setUserInfo(data.record);
      // 2.添加动态路由
      await initDynamicRouter();
      // 3.清除上个账号的 tab 信息
      tabsStore.closeMultipleTab();
      // 4.跳转到首页
      router.push(HOME_URL);
      ElNotification({
        title: getTimeState(),
        message: "欢迎登录 Geeker-Admin",
        type: "success",
        duration: 3000
      });
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
  // 监听enter事件（调用登录）
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
