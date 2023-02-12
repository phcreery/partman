import { computed, onBeforeMount } from "vue";
import { getLightColor, getDarkColor } from "@/utils/theme/tool";
import { GlobalStore } from "@/stores";
import { DEFAULT_PRIMARY } from "@/config/config";
import { ElMessage } from "element-plus";

/**
 * @description Switching topics
 * */
export const useTheme = () => {
  const globalStore = GlobalStore();
  const themeConfig = computed(() => globalStore.themeConfig);

  // Switch to dark mode
  const switchDark = () => {
    const body = document.documentElement as HTMLElement;
    if (themeConfig.value.isDark) body.setAttribute("class", "dark");
    else body.setAttribute("class", "");
    changePrimary(themeConfig.value.primary);
  };

  // Modify theme color
  const changePrimary = (val: string) => {
    if (!val) {
      val = DEFAULT_PRIMARY;
      ElMessage({ type: "success", message: `The theme color has been reset to ${DEFAULT_PRIMARY}` });
    }
    globalStore.setThemeConfig({ ...themeConfig.value, primary: val });
    // To be compatible with the dark mode theme color is also normal，The following method calculates the theme color From deep to light The specific color of the
    document.documentElement.style.setProperty("--el-color-primary", themeConfig.value.primary);
    document.documentElement.style.setProperty(
      "--el-color-primary-dark-2",
      themeConfig.value.isDark
        ? `${getLightColor(themeConfig.value.primary, 0.2)}`
        : `${getDarkColor(themeConfig.value.primary, 0.3)}`
    );
    // Deepening or lightening of color
    for (let i = 1; i <= 9; i++) {
      document.documentElement.style.setProperty(
        `--el-color-primary-light-${i}`,
        themeConfig.value.isDark
          ? `${getDarkColor(themeConfig.value.primary, i / 10)}`
          : `${getLightColor(themeConfig.value.primary, i / 10)}`
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
