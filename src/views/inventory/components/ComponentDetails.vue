<template>
  <el-row justify="space-around">
    <el-col :span="23">
      <el-descriptions border :column="1" :title="props.title">
        <el-descriptions-item label="Manufacturer" label-align="right">{{ props.rowData?.manufacturer }}</el-descriptions-item>
        <el-descriptions-item label="Manufacturer Part Number" label-align="right">{{ props.rowData?.mpn }}</el-descriptions-item>
        <el-descriptions-item label="Description" label-align="right">{{ props.rowData?.description }}</el-descriptions-item>
        <el-descriptions-item label="Category" label-align="right">
          {{ enumRender("category", props.rowData?.category) }}
        </el-descriptions-item>
        <el-descriptions-item label="Stock" label-align="right">{{ props.rowData?.stock }}</el-descriptions-item>
        <el-descriptions-item label="Storage Location" label-align="right">
          {{ enumRender("storage_location", props.rowData?.storage_location) }}
        </el-descriptions-item>
        <el-descriptions-item label="Footprint" label-align="right">
          {{ enumRender("footprint", props.rowData?.footprint) }}
        </el-descriptions-item>
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
    </el-col>
  </el-row>
</template>

<script setup lang="ts" name="ComponentDetails">
import { Component } from "@/api/interface";
import { filterEnum } from "@/utils/util";

interface DetailsProps {
  title: string;
  isView: boolean;
  rowData?: Component.ResGetComponentRecord;
  enumMap?: Map<string, { [key: string]: any }[]>;
}

const props = defineProps<DetailsProps>();

const enumRender = (prop: string, value: any) => {
  if (!props.enumMap) return value;
  if (props.enumMap.has(prop)) {
    return filterEnum(value, props.enumMap.get(prop), { value: "id", label: "name" });
  } else {
    return value;
  }
};
</script>

<style lang="scss"></style>
