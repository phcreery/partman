<template>
  <div>
    <el-row>
      <el-col :span="24"> What changed: {{ prettyPrint(compareObj(componentA, componentB)) }} </el-col>
    </el-row>
    <el-row justify="space-around">
      <el-col :span="12">
        Before:
        <!-- <div style="white-space: pre-wrap">{{ prettyPrint(props.componentA) }}</div> -->
        <ComponentDetails
          :title="props.componentA?.mpn ?? '[empty]'"
          :isView="true"
          :rowData="props.componentA"
        ></ComponentDetails>
      </el-col>
      <el-col :span="12">
        After:
        <!-- <div style="white-space: pre-wrap">{{ prettyPrint(props.componentB) }}</div> -->
        <ComponentDetails
          :title="props.componentB?.mpn ?? '[empty]'"
          :isView="true"
          :rowData="props.componentB"
        ></ComponentDetails>
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
