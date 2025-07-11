<template>
  <div v-if="columns.length" class="card table-search">
    <el-form ref="formRef" :model="searchParam">
      <grid ref="gridRef" :collapsed="collapsed" :gap="[20, 0]" :cols="searchCol">
        <grid-item v-for="(item, index) in columns" :key="item.prop" v-bind="getResponsive(item)" :index="index">
          <el-form-item>
            <template #label>
              <el-space :size="4">
                <span>{{ `${item.search?.label ?? item.label}` }}</span>
                <el-tooltip v-if="item.search?.tooltip" effect="dark" :content="item.search?.tooltip" placement="top">
                  <i :class="'iconfont icon-yiwen'"></i>
                </el-tooltip>
              </el-space>
              <span>&nbsp;:</span>
            </template>
            <search-form-item :column="item" :search-param="searchParam" />
          </el-form-item>
        </grid-item>
        <grid-item suffix>
          <div class="operation">
            <el-button type="primary" :icon="Search" @click="search"> Search </el-button>
            <el-button :icon="Delete" @click="reset"> Reset </el-button>
            <el-button v-if="showCollapse" type="primary" link class="search-isOpen" @click="collapsed = !collapsed">
              {{ collapsed ? "Expand" : "Collapse" }}
              <el-icon class="el-icon--right">
                <component :is="collapsed ? ArrowDown : ArrowUp" />
              </el-icon>
            </el-button>
          </div>
        </grid-item>
      </grid>
    </el-form>
  </div>
</template>
<script setup lang="ts">
defineOptions({ name: "SearchForm" });
import { computed, ref } from "vue";
import type { ColumnProps } from "@/components/ProTable/interface";
import type { BreakPoint } from "@/components/Grid/interface";
import { Delete, Search, ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import SearchFormItem from "./components/SearchFormItem.vue";
import Grid from "@/components/Grid/index.vue";
import GridItem from "@/components/Grid/components/GridItem.vue";

interface ProTableProps {
  columns?: ColumnProps[]; // 搜索配置列
  searchParam?: { [key: string]: any }; // 搜索参数
  searchCol: number | Record<BreakPoint, number>;
  search: (_params: any) => void; // 搜索方法
  reset: (_params: any) => void; // 重置方法
}

// 默认值
const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  searchParam: () => ({})
});

// 获取响应式设置
const getResponsive = (item: ColumnProps) => {
  return {
    span: item.search?.span,
    offset: item.search?.offset ?? 0,
    xs: item.search?.xs,
    sm: item.search?.sm,
    md: item.search?.md,
    lg: item.search?.lg,
    xl: item.search?.xl
  };
};

// 是否默认折叠搜索项
const collapsed = ref(true);

// 获取响应式断点
const gridRef = ref();
const breakPoint = computed<BreakPoint>(() => gridRef.value?.breakPoint);

// 判断是否显示 展开/合并 按钮
const showCollapse = computed(() => {
  let show = false;
  props.columns.reduce((prev, current) => {
    prev +=
      (current.search![breakPoint.value]?.span ?? current.search?.span ?? 1) +
      (current.search![breakPoint.value]?.offset ?? current.search?.offset ?? 0);
    if (typeof props.searchCol !== "number") {
      if (prev >= props.searchCol[breakPoint.value]) show = true;
    } else {
      if (prev >= props.searchCol) show = true;
    }
    return prev;
  }, 0);
  return show;
});
</script>
