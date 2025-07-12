<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="6">
        <el-card shadow="hover">
          <b>{{ qty.totalComponents }}</b> Total Components
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <b>{{ qty.uniqueComponents }}</b> Unique Components
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <b>{{ qty.totalStorageLocations }}</b> Storage Locations
        </el-card>
      </el-col>
      <!-- <el-col :span="6">
        <el-card shadow="hover">
          Categories: <b>{{ qty.total_categories }}</b>
        </el-card>
      </el-col> -->
      <el-col :span="6">
        <el-card shadow="hover">
          <b>{{ qty.totalProjects }}</b> Projects
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col :span="12">
        <el-card shadow="never">
          <div ref="componentStorageTreeRef" style="width: 100%; height: 400px"></div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <b>{{ qty.totalProjectBuilds }}</b> Project Builds
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          Version <b>{{ qty.version }}</b>
          <br />
          <!-- <el-text type="info">Update Available?</el-text> -->
          <el-button type="info" link @click="checkForUpdate"> Check for Update </el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="Home">
import { ref, reactive, onMounted, computed, watch } from "vue";
import * as echarts from "echarts";
import echartsThemeWonderland from "./echarts-theme-wonderland.json";
import echartsThemeWonderlandDark from "./echarts-theme-wonderland-dark.json";
import { getDashboardInfo } from "@/api/modules/components";
import { useGlobalStore } from "@/stores/modules/global";
import { useEcharts } from "@/hooks/useEcharts";

const componentStorageTreeRef = ref(null);

const globalStore = useGlobalStore();
const themeConfig = computed(() => globalStore);

const qty = reactive({
  totalComponents: 0,
  uniqueComponents: 0,
  totalProjects: 0,
  // totalCategories: 0,
  totalStorageLocations: 0,
  totalProjectBuilds: 0,
  version: ""
});

let storageLocationTreeChart: echarts.ECharts;

const storageLocationTreeOption: echarts.EChartsOption = {
  title: {
    text: "STORAGE LOCATION DISTRIBUTION",
    subtext: "",
    textStyle: {
      fontSize: 14,
      align: "center"
    },
    subtextStyle: {
      align: "center"
    },
    sublink: "https://worldcoffeeresearch.org/work/sensory-lexicon/"
  },
  series: {
    type: "sunburst",
    // emphasis: {
    //     focus: 'ancestor'
    // },
    data: [],
    sort: undefined,
    // radius: [0, "90%"],
    // radius: ["15%", "80%"],
    radius: [60, "90%"],

    itemStyle: {
      borderRadius: 7,
      borderWidth: 2
    },
    label: {
      rotate: "radial"
    }
  }
};

echarts.registerTheme("wonderland", echartsThemeWonderland);
echarts.registerTheme("wonderland-dark", echartsThemeWonderlandDark);

const getQty = async () => {
  const res = await getDashboardInfo();
  qty.totalComponents = Number(res.totalComponents);
  qty.uniqueComponents = res.uniqueComponents;
  qty.totalProjects = res.totalProjects;
  // qty.value.total_categories = res.total_categories;
  qty.totalStorageLocations = res.totalStorageLocations;
  qty.totalProjectBuilds = res.totalProjectBuilds;
  qty.version = res.version;
  (storageLocationTreeOption.series! as echarts.PieSeriesOption).data = res.storageLocationsTree;
};

const drawChart = () => {
  // Dispose of the previous chart instance if it exists
  storageLocationTreeChart && storageLocationTreeChart.dispose ? storageLocationTreeChart.dispose() : null;
  storageLocationTreeChart = echarts.init(
    componentStorageTreeRef.value as unknown as HTMLElement,
    themeConfig.value.isDark ? "wonderland-dark" : "wonderland"
  );
  useEcharts(storageLocationTreeChart, storageLocationTreeOption);
};

onMounted(async () => {
  await getQty();
  drawChart();
});

// watch themeConfig.isDark, update theme
watch(
  () => themeConfig.value.isDark,
  () => {
    drawChart();
  }
);

function checkForUpdate() {
  window.open("https://github.com/phcreery/partman/releases");
}
</script>

<style scoped lang="scss">
@use "./index.scss" as *;
.el-row {
  margin-bottom: 12px;
}
</style>
