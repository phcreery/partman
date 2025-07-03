<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="6">
        <el-card shadow="hover">
          <b>{{ qty.total_components }}</b> Total Components
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <b>{{ qty.unique_components }}</b> Unique Components
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <b>{{ qty.total_storage_locations }}</b> Storage Locations
        </el-card>
      </el-col>
      <!-- <el-col :span="6">
        <el-card shadow="hover">
          Categories: <b>{{ qty.total_categories }}</b>
        </el-card>
      </el-col> -->
      <el-col :span="6">
        <el-card shadow="hover">
          <b>{{ qty.total_projects }}</b> Projects
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
import { ref, onMounted, computed, watch } from "vue";
import * as echarts from "echarts";
import echartsThemeWonderland from "./echarts-theme-wonderland.json";
import echartsThemeWonderlandDark from "./echarts-theme-wonderland-dark.json";
import { getDashboardInfo } from "@/api/modules/components";
import { useGlobalStore } from "@/stores/modules/global";
import { useEcharts } from "@/hooks/useEcharts";

const componentStorageTreeRef = ref(null);

const globalStore = useGlobalStore();
const themeConfig = computed(() => globalStore);

const qty = ref({
  total_components: 0,
  unique_components: 0,
  total_projects: 0,
  // total_categories: 0,
  total_storage_locations: 0,
  version: ""
});
const storageLocationTreeData = ref([{}]);

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
    data: storageLocationTreeData.value,
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
  qty.value.total_components = Number(res.totalComponents);
  qty.value.unique_components = res.uniqueComponents;
  qty.value.total_projects = res.totalProjects;
  // qty.value.total_categories = res.total_categories;
  qty.value.total_storage_locations = res.totalStorageLocations;
  qty.value.version = res.version;

  storageLocationTreeData.value = res.storageLocationsTree;
};

const drawChart = () => {
  storageLocationTreeChart && storageLocationTreeChart.dispose ? storageLocationTreeChart.dispose() : null;
  storageLocationTreeChart = echarts.init(
    componentStorageTreeRef.value as unknown as HTMLElement,
    themeConfig.value.isDark ? "wonderland-dark" : "wonderland"
  );
  (storageLocationTreeOption.series! as echarts.PieSeriesOption).data = storageLocationTreeData.value;
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
