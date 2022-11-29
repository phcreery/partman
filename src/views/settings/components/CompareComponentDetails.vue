<template>
  <div>
    <el-row>
      <el-col :span="24"> What changed: {{ prettyPrint(compareObj(componentA, componentB)) }} </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        Before
        <div style="white-space: pre-wrap">{{ prettyPrint(props.componentA) }}</div>
      </el-col>
      <el-col :span="12">
        After
        <div style="white-space: pre-wrap">{{ prettyPrint(props.componentB) }}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="CompareComponentDetails">
// import { genderType } from "@/utils/serviceDict";
import { Component } from "@/api/interface";

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
  for (var i in obj2) {
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

<style lang="scss"></style>
