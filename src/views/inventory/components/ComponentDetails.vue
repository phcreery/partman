<template>
  <el-row justify="space-around">
    <el-col :span="23">
      <h2>{{ props.title }}</h2>
    </el-col>
  </el-row>
  <el-row justify="space-around">
    <el-col :span="11">
      <div class="demo-image__error">
        <div class="block">
          <!-- <span class="demonstration">Custom</span> -->
          <div class="demo-image__preview">
            <el-image :src="getFileUrl(props.rowData, props.rowData!.image)" :zoom-rate="1.2" fit="cover">
              <template #error>
                <div class="image-slot">
                  <el-icon><icon-picture /></el-icon>
                </div>
              </template>
            </el-image>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="11">
      <el-descriptions border :column="1">
        <el-descriptions-item label="Manufacturer" label-align="right">{{ props.rowData?.manufacturer }}</el-descriptions-item>
        <el-descriptions-item label="Manufacturer Part Number" label-align="right">{{ props.rowData?.mpn }}</el-descriptions-item>
        <el-descriptions-item label="Description" label-align="right">{{ props.rowData?.description }}</el-descriptions-item>
        <el-descriptions-item v-if="props.enumMap" label="Category" label-align="right">
          {{ enumRender("category", props.rowData?.category) }}
        </el-descriptions-item>
        <el-descriptions-item label="Stock" label-align="right">{{ props.rowData?.stock }}</el-descriptions-item>
        <el-descriptions-item v-if="props.enumMap" label="Storage Location" label-align="right">
          {{ enumRender("storage_location", props.rowData?.storage_location) }}
        </el-descriptions-item>
        <el-descriptions-item v-if="props.enumMap" label="Footprint" label-align="right">
          {{ enumRender("footprint", props.rowData?.footprint) }}
        </el-descriptions-item>
        <el-descriptions-item v-if="props.enumMap" label="Supplier" label-align="right">{{
          enumRender("footprint", props.rowData?.supplier)
        }}</el-descriptions-item>
        <el-descriptions-item v-if="props.enumMap" label="Supplier Part Number" label-align="right">{{
          props.rowData?.spn
        }}</el-descriptions-item>
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
import { Picture as IconPicture } from "@element-plus/icons-vue";
import { Component } from "@/api/interface";
import { filterEnum } from "@/utils/util";
import { getFileUrl } from "@/api/modules/components";

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

<style lang="scss" scoped>
.demo-image__error .block {
  // box-sizing: border-box;
  // display: inline-block;
  width: 100%;

  // padding: 30px 0;
  text-align: center;
  vertical-align: top;

  // border-right: solid 1px var(--el-border-color);
}
.demo-image__error .el-image {
  width: 100%;

  // max-width: 300px;
  height: 500px;

  // max-height: 200px;
  // padding: 0 5px;
}
.demo-image__error .image-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 30px;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-light);
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
</style>
