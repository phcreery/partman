<template>
  <component
    v-if="column.search?.el"
    :is="`el-${column.search.el}`"
    v-bind="column.search.props"
    v-model="searchParam[column.search.key ?? handleProp(column.prop!)]"
    :data="column.search?.el === 'tree-select' ? columnEnum : []"
    :options="column.search?.el === 'cascader' ? columnEnum : []"
    :placeholder="placeholder(column)"
    :clearable="clearable(column)"
    range-separator="To"
    start-placeholder="Start time"
    end-placeholder="Ending time"
  >
    <template #default="{ data }" v-if="column.search.el === 'cascader'">
      <span>{{ data[fieldNames().label] }}</span>
    </template>
    <template v-if="column.search.el === 'select'">
      <component
        :is="`el-option`"
        v-for="(col, index) in columnEnum"
        :key="index"
        :label="col[fieldNames().label]"
        :value="col[fieldNames().value]"
      ></component>
    </template>
    <slot v-else></slot>
  </component>
</template>

<script setup lang="ts" name="searchFormItem">
import { computed, inject, ref } from "vue";
import { handleProp } from "@/utils/util";
import { ColumnProps } from "@/components/ProTable/interface";

interface SearchFormItem {
  column: ColumnProps; // 具体每一个搜索项of配置
  searchParam: { [key: string]: any }; // Search Parameters
}
const props = defineProps<SearchFormItem>();

// Acceptance enumMap
const enumMap = inject("enumMap", ref(new Map()));

const columnEnum = computed(() => {
  if (!enumMap.value.get(props.column.prop)) return [];
  return enumMap.value.get(props.column.prop);
});

// Judgment fieldNames Settings label && value 的 key Value
const fieldNames = () => {
  return {
    label: props.column.fieldNames?.label ?? "label",
    value: props.column.fieldNames?.value ?? "value"
  };
};

// Judgment placeholder
const placeholder = (column: ColumnProps) => {
  return column.search?.props?.placeholder ?? (column.search?.el === "input" ? "Please enter" : "Please select");
};

// Availability of clear button (When the search term has a default value，Clear button is not displayed)
const clearable = (column: ColumnProps) => {
  return column.search?.props?.clearable ?? (column.search?.defaultValue == null || column.search?.defaultValue == undefined);
};
</script>
