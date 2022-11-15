<template>
  <div>
    <!-- <div class="home flx-center">
    Dashboard
  </div> -->
    <el-row :gutter="12">
      <el-col :span="6">
        <el-card shadow="hover">
          Components: <b>{{ qty.total_components }}</b>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          Unique Components: <b>{{ qty.unique_components }}</b></el-card
        >
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          Storage Locations: <b>{{ qty.total_storage_locations }}</b></el-card
        >
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          Categories: <b>{{ qty.total_categories }}</b></el-card
        >
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col :span="6">
        <el-card shadow="hover">
          Projects: <b>{{ qty.total_projects }}</b></el-card
        >
      </el-col>
    </el-row>
    <!-- <div ref="componentQtyOverTime" style="width: 100%; height: 400px"></div> -->
    <!-- <div ref="componentStorageLocationTree" style="width: 600px; height: 400px"></div> -->
    <!-- <div ref="componentCategoryOverTime" style="width: 600px; height: 400px"></div> -->
    <div ref="componentStorageTree" style="width: 600px; height: 400px"></div>
  </div>
</template>

<script setup lang="ts" name="dashboard">
import { ref, reactive, onMounted } from "vue";
import * as echarts from "echarts";
import echartsThemeWonderland from "./echarts-theme-wonderland.json";
// import { Component, ComponentCategory, Footprint, Storage, StorageCategory } from "@/api/interface";
import { getDashboardQty, getDashboardStorageLocationTree } from "@/api/modules/components";

// const componentQtyOverTime = ref(null);
// const componentStorageLocationTree = ref(null);
// const componentCategoryOverTime = ref(null);
const componentStorageTree = ref(null);

// const componentQtyOverTimeOption = {
//   xAxis: {
//     type: "category",
//     data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
//   },
//   yAxis: {
//     type: "value"
//   },
//   series: [
//     {
//       data: [150, 230, 224, 218, 135, 147, 260],
//       type: "line"
//     }
//   ]
// };

const qty = ref({
  unique_components: 0,
  total_components: 0,
  total_projects: 0,
  total_categories: 0,
  total_storage_locations: 0
});
const storageLocationTreeData = ref([]);

const treeOption = {
  series: {
    type: "sunburst",
    // emphasis: {
    //     focus: 'ancestor'
    // },
    data: storageLocationTreeData.value,
    sort: undefined,
    // radius: [0, "90%"],
    radius: ["15%", "80%"],
    label: {
      rotate: "radial"
    }
  }
};

echarts.registerTheme("wonderland", echartsThemeWonderland);

const getQty = async () => {
  const res = await getDashboardQty();
  qty.value = res.data;
  console.log(qty);

  const storageLocationTree = await getDashboardStorageLocationTree();
  // iterate recursively and find each elements where child = [] and set value: 1
  function iter(o: any) {
    if (o.children && o.children.length !== 0) {
      o.children.forEach((c: any) => iter(c));
    } else {
      o.value = 1;
    }
  }
  storageLocationTree.data.forEach((c: any) => iter(c));
  storageLocationTreeData.value = storageLocationTree.data;
  console.log(storageLocationTreeData);
};

onMounted(async () => {
  // let componentQtyOverTimeChart = echarts.init(componentQtyOverTime.value);
  // componentQtyOverTimeChart.setOption(componentQtyOverTimeOption);
  // let componentStorageLocationTreeChart = echarts.init(componentStorageLocationTree.value);
  // componentStorageLocationTreeChart.setOption(componentQtyOverTimeOption);
  // let componentCategoryOverTimeChart = echarts.init(componentCategoryOverTime.value);
  // componentCategoryOverTimeChart.setOption(componentQtyOverTimeOption);

  // qty = await (await getDashboardQty()).data;
  // console.log(qty);
  await getQty();

  console.log(storageLocationTreeData.toString());
  let storageLocationTreeChart = echarts.init(componentStorageTree.value, "wonderland");
  treeOption.series.data = storageLocationTreeData.value;
  storageLocationTreeChart.setOption(treeOption);
});
</script>

<style scoped lang="scss">
@import "./index.scss";
.el-row {
  margin-bottom: 12px;
}
</style>
