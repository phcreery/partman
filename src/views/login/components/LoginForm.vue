<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="Username/Email" @keydown="onKeydown">
        <template #prefix>
          <el-icon class="el-input__icon"><user /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        type="password"
        v-model="loginForm.password"
        placeholder="Password"
        show-password
        autocomplete="new-password"
        @keydown="onKeydown"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-button :icon="CircleClose" round @click="resetForm(loginFormRef)" size="large">Reset</el-button>
    <el-button :icon="Key" round @click="login(loginFormRef, true)" size="large" :loading="loading"> Admin Login </el-button>
    <el-button :icon="UserFilled" round @click="login(loginFormRef)" size="large" type="primary" :loading="loading">
      Login
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { Login } from "@/api/interface";
// import { ElNotification } from "element-plus";
import { loginApi, loginApiAsAdmin } from "@/api/modules/login";
import { useUserStore } from "@/stores/modules/user";
import { useTabsStore } from "@/stores/modules/tabs";
// import { getTimeState } from "@/utils/util";
import { HOME_URL } from "@/config";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { CircleClose, UserFilled, Key } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";
// import md5 from "js-md5";

const router = useRouter();
const tabsStore = useTabsStore();
const userStore = useUserStore();

type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
const loginRules = reactive({
  username: [{ required: true, message: "Please enter user name", trigger: "blur" }],
  password: [{ required: true, message: "Please enter the password", trigger: "blur" }]
});
const loading = ref(false);
const loginForm = reactive<Login.ReqLoginForm>({
  username: "",
  password: ""
});
const login = (formEl: FormInstance | undefined, admin: boolean = false) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    try {
      // const { data } = await loginApi({ ...loginForm, password: md5(loginForm.password) });
      if (admin) {
        // Admin login logic
        const data = await loginApiAsAdmin(loginForm);
        console.log("login data", data);
        userStore.setToken(data.token);
        userStore.setUserInfo({
          id: data.record.id,
          email: data.record.email,
          // avatar: data.record.avatar,
          username: data.record.email
        });
      } else {
        const data = await loginApi(loginForm);
        console.log("login data", data);
        userStore.setToken(data.token);
        userStore.setUserInfo({
          id: data.record.id,
          email: data.record.email,
          // avatar: data.record.avatar,
          username: data.record.username
        });
      }

      // 2.添加动态路由
      await initDynamicRouter();

      // 3.清除上个账号的 tab 信息
      tabsStore.closeMultipleTab();
      tabsStore.setTabs([]);
      // keepAliveStore.setKeepAliveName([])

      // 4.跳转到首页
      router.push(HOME_URL);
      // router.push({ name: "home" });
      // ElNotification({
      //   title: getTimeState(),
      //   message: "Welcome to partman",
      //   type: "success",
      //   duration: 3000
      // });
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

const onKeydown = (e: Event | KeyboardEvent) => {
  if (!(e instanceof KeyboardEvent)) return;
  if (e.code === "Enter" || e.code === "NumpadEnter") {
    if (loading.value) return;
    login(loginFormRef.value, false);
  }
};
</script>

<style scoped lang="scss">
@use "../index" as *;
</style>
