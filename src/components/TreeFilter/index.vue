<template>
  <div class="card filter">
    <h4 class="title sle" v-if="title">{{ title }}</h4>
    <el-input v-model="filterText" placeholder="输入关键字进行Filtering" clearable />
    <el-scrollbar :style="{ height: title ? `calc(100% - 95px)` : `calc(100% - 56px)` }">
      <el-tree
        ref="treeRef"
        default-expand-all
        :node-key="id"
        :data="treeData"
        :show-checkbox="multiple"
        :check-strictly="false"
        :current-node-key="!multiple ? defaultValue : ''"
        :highlight-current="!multiple"
        :expand-on-click-node="false"
        :check-on-click-node="multiple"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :default-checked-keys="multiple ? defaultValue : []"
        @node-click="handleNodeClick"
        @check="handleCheckChange"
      />
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts" name="TreeFilter">
import { ref, watch, onBeforeMount } from "vue";
import { ElTree } from "element-plus";

// Receive parent component parameters and set default values
interface TreeFilterProps {
  requestApi?: (data?: any) => Promise<any>; // RequestCategorized data的 api ==> Not a must pass
  data?: { [key: string]: any }[]; // 分类数据，If categorical data is available，will not be executed api 请求 ==> Not a must pass
  title?: string; // treeFilter Title ==> Not a must pass
  id?: string; // Selectedid ==> Not a must pass，Default is “id”
  label?: string; // Displayedlabel ==> Not a must pass，Default is “label”
  multiple?: boolean; // Whether it is multiple choice ==> Not a must pass，Default is false
  defaultValue?: any; // Default selected value ==> Not a must pass
}
const props = withDefaults(defineProps<TreeFilterProps>(), {
  id: "id",
  label: "label",
  multiple: false
});

const defaultProps = {
  children: "children",
  label: props.label
};

const filterText = ref<string>("");
const treeRef = ref<InstanceType<typeof ElTree>>();
const treeData = ref<{ [key: string]: any }[]>([]);

onBeforeMount(async () => {
  if (props.data?.length) return (treeData.value = props.data);
  const { data } = await props.requestApi!();
  if (props.multiple) return (treeData.value = data);
  treeData.value = [{ id: "", [props.label]: "All" }, ...data];
});

watch(filterText, val => {
  treeRef.value!.filter(val);
});

// 过滤
const filterNode = (value: string, data: { [key: string]: any }, node: any) => {
  if (!value) return true;
  let parentNode = node.parent,
    labels = [node.label],
    level = 1;
  while (level < node.level) {
    labels = [...labels, parentNode.label];
    parentNode = parentNode.parent;
    level++;
  }
  return labels.some(label => label.indexOf(value) !== -1);
};

interface FilterEmits {
  (e: "change", value: any): void;
}
const emit = defineEmits<FilterEmits>();

// Single choice
const handleNodeClick = (data: { [key: string]: any }) => {
  if (props.multiple) return;
  emit("change", data[props.id]);
};

// Multiple Choice
const handleCheckChange = () => {
  emit("change", treeRef.value?.getCheckedKeys());
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
