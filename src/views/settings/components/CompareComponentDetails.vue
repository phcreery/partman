<template>
  <div>
    <el-row justify="center">
      <el-col :span="23">
        <h2>What changed:</h2>
        <code>{{ prettyPrint(compareObj(componentA, componentB)) }}</code>
      </el-col>
    </el-row>
    <el-row justify="space-around">
      <el-col :span="11">
        <h3>Before:</h3>
        <ComponentDetails :title="props.componentA?.mpn ?? '[empty]'" :isView="true" :rowData="props.componentA" />
      </el-col>
      <el-divider direction="vertical" style="height: auto" />
      <el-col :span="11">
        <h3>After:</h3>
        <ComponentDetails :title="props.componentB?.mpn ?? '[empty]'" :isView="true" :rowData="props.componentB" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="CompareComponentDetails">
import { Component } from "@/api/interface";
import ComponentDetails from "@/views/inventory/components/ComponentDetails.vue";

interface DetailsProps {
  isView: boolean;
  componentA?: Component.ResGetComponentRecord;
  componentB?: Component.ResGetComponentRecord;
}

const props = defineProps<DetailsProps>();

function prettyPrint(obj: any): string {
  return JSON.stringify(obj, null, "\t");
}

function isEmpty(value: any) {
  return Boolean(value && typeof value === "object") && !Object.keys(value).length;
}

function compareObj(obj1: any, obj2: any): { [key: string]: any } {
  let ret: { [key: string]: any } = {};
  let rett: { [key: string]: any } = {};
  for (let i in obj2) {
    rett = {};
    if (obj1 === null) continue;
    if (typeof obj2[i] === "object") {
      rett = compareObj(obj1[i], obj2[i]);
      if (!isEmpty(rett)) {
        ret[i] = rett;
      }
    } else {
      if (!obj1 || !obj1.hasOwnProperty(i) || obj2[i] !== obj1[i]) {
        ret[i] = obj2[i];
      }
    }
  }
  return ret;
}
</script>

<style scoped lang="scss">
.el-row {
  margin-bottom: 12px;
}
</style>
