<template>
  <el-descriptions border>
    <el-descriptions-item label="Manufacturer" label-align="right">{{ props.rowData?.manufacturer }}</el-descriptions-item>
    <el-descriptions-item label="Manufacturer Part Number" label-align="right">{{ props.rowData?.mpn }}</el-descriptions-item>
    <el-descriptions-item label="Description" label-align="right">{{ props.rowData?.description }}</el-descriptions-item>
    <el-descriptions-item label="Stock" label-align="right">{{ props.rowData?.stock }}</el-descriptions-item>
    <el-descriptions-item label="Storage Location" label-align="right">{{
      props.rowData?.storage_location
    }}</el-descriptions-item>
    <el-descriptions-item label="Footprint" label-align="right">{{ props.rowData?.footprint }}</el-descriptions-item>
    <el-descriptions-item label="Supplier" label-align="right">{{ props.rowData?.supplier }}</el-descriptions-item>
    <el-descriptions-item label="Supplier Part Number" label-align="right">{{ props.rowData?.spn }}</el-descriptions-item>
    <el-descriptions-item label="Internal Part Number" label-align="right">{{ props.rowData?.ipn }}</el-descriptions-item>
    <el-descriptions-item
      v-for="item in props.rowData?.specs"
      :key="item.attribute"
      :label="item.attribute.name"
      label-align="right"
    >
      {{ item.value }} {{ item.units }}
    </el-descriptions-item>

    <el-descriptions-item label="Comments" label-align="right">{{ props.rowData?.comment }}</el-descriptions-item>
  </el-descriptions>

  <!-- <div>component: {{ props.rowData }}</div> -->
</template>

<script setup lang="ts" name="ComponentDetails">
import { ref, reactive, watch } from "vue";
import { Refresh, Plus, Search, Delete } from "@element-plus/icons-vue";
import { ElMessage, FormInstance } from "element-plus";
// import { genderType } from "@/utils/serviceDict";
import { Component, ComponentCategory, Footprint, Storage, StorageCategory } from "@/api/interface";
import {
  getFootprintsEnum,
  getComponentStorageLocationEnum,
  getStorageLocationPathEnumTree,
  getComponentCategoryEnumTree,
  postFootprintCreate,
  postStorageCreate,
  postComponentCategoryCreate
} from "@/api/modules/components";
import { nestedObjectAssign } from "@/utils/nestedObjectAssign";

interface DetailsProps {
  title: string;
  isView: boolean;
  rowData?: Component.ResGetComponentRecord;
}

const props = defineProps<DetailsProps>();
</script>

<style lang="scss"></style>
