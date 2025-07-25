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
    <el-button :icon="Key" round @click="login(loginFormRef, LoginTypes.ADMIN)" size="large" :loading="loading">
      Admin Login
    </el-button>
    <el-button
      :icon="UserFilled"
      round
      @click="login(loginFormRef, LoginTypes.USER)"
      size="large"
      type="primary"
      :loading="loading"
    >
      Login
    </el-button>
    <el-divider v-if="authMethods?.oauth2?.enabled && authMethods.oauth2.providers.length > 0">
      Or Login with Provider
    </el-divider>
    <el-button
      v-if="authMethods?.oauth2?.enabled && authMethods.oauth2.providers.length > 0"
      v-for="(method, index) in authMethods.oauth2.providers"
      :key="index"
      round
      size="large"
      style="width: 100%"
      @click="login(loginFormRef, LoginTypes.OAUTH2, method.name)"
    >
      Login with {{ method.displayName }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
// import { ElNotification } from "element-plus";
import { ElMessage } from "element-plus";
import { CircleClose, UserFilled, Key } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";

// Config
import { HOME_URL } from "@/config";

// API
import { Login } from "@/api/interface";
import { listAuthMethods, loginApi, loginApiAsAdmin, loginApiWithOAuth2 } from "@/api/modules/login";

// Stores
import { useUserStore } from "@/stores/modules/user";
import { useTabsStore } from "@/stores/modules/tabs";

// Utils
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";

const LoginTypes = {
  ADMIN: "admin",
  USER: "user",
  OAUTH2: "OAuth2"
} as const;

type LoginType = (typeof LoginTypes)[keyof typeof LoginTypes];

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
const authMethods = ref<Login.ResAuthMethods | null>(null);
const login = (formEl: FormInstance | undefined, authType: LoginType = "user", provider?: string) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid && authType !== LoginTypes.OAUTH2) return;
    loading.value = true;
    try {
      if (authType === LoginTypes.ADMIN) {
        // Admin login logic
        const data = await loginApiAsAdmin(loginForm);
        // if dev
        if (import.meta.env.DEV) {
          console.log("Admin login data", data);
        }
      } else if (authType === LoginTypes.OAUTH2) {
        if (!provider) {
          console.error("Provider is required for OAuth2 login");
          ElMessage.error("Provider is required for OAuth2 login");
          return;
        }
        const data = await loginApiWithOAuth2(provider);
        if (import.meta.env.DEV) {
          console.log("OAuth2 login data", data);
        }
      } else {
        const data = await loginApi(loginForm);
        if (import.meta.env.DEV) {
          console.log("login data", data);
        }
      }

      // 2. Add dynamic routes
      await initDynamicRouter();

      // 3. Clear the previous account's tab information
      tabsStore.closeMultipleTab();
      tabsStore.setTabs([]);
      // keepAliveStore.setKeepAliveName([])

      // 4. Redirect to home page
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
    login(loginFormRef.value);
  }
};

onMounted(async () => {
  authMethods.value = await listAuthMethods();
  console.log("Auth Methods", authMethods.value);
});
</script>

<style scoped lang="scss">
@use "../index" as *;
</style>
