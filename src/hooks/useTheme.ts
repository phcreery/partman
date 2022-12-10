import { computed, onBeforeMount } from "vue";
import { getLightColor, getDarkColor } from "@/utils/theme/tool";
import { GlobalStore } from "@/store";
import { ElMessage } from "element-plus";

/**
 * @description Switch theme
 * */
export const useTheme = () => {
  const globalStore = GlobalStore();
  const themeConfig = computed(() => globalStore.themeConfig);

  // Switch the dark mode
  const switchDark = () => {
    const body = document.documentElement as HTMLElement;
    if (themeConfig.value.isDark) body.setAttribute("class", "dark");
    else body.setAttribute("class", "");
  };

  // Modify theme color
  const changePrimary = (val: string) => {
    if (!val) {
      val = "#409EFF";
      ElMessage({ type: "success", message: "Theme color has been reset to #409EFF" });
    }
    globalStore.setThemeConfig({ ...themeConfig.value, primary: val });
    // Deepen
    document.documentElement.style.setProperty("--el-color-primary-dark-2", `${getDarkColor(themeConfig.value.primary, 0.1)}`);
    document.documentElement.style.setProperty("--el-color-primary", themeConfig.value.primary);
    // Shallow color
    for (let i = 1; i <= 9; i++) {
      document.documentElement.style.setProperty(
        `--el-color-primary-light-${i}`,
        `${getLightColor(themeConfig.value.primary, i / 10)}`
      );
    }
  };

  // Gray and weak color switching
  const changeGreyOrWeak = (value: boolean, type: string) => {
    const body = document.body as HTMLElement;
    if (!value) return body.setAttribute("style", "");
    if (type === "grey") body.setAttribute("style", "filter: grayscale(1)");
    if (type === "weak") body.setAttribute("style", "filter: invert(80%)");
    let propName = type == "grey" ? "isWeak" : "isGrey";
    globalStore.setThemeConfig({ ...themeConfig.value, [propName]: false });
  };

  onBeforeMount(() => {
    switchDark();
    changePrimary(themeConfig.value.primary);
    if (themeConfig.value.isGrey) changeGreyOrWeak(true, "grey");
    if (themeConfig.value.isWeak) changeGreyOrWeak(true, "weak");
  });

  return {
    switchDark,
    changePrimary,
    changeGreyOrWeak
  };
};
