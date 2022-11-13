<template>
  <div class="table-search" v-if="columns.length">
    <el-form ref="formRef" :model="searchParam" :inline="true" label-width="100px" :style="`max-width: ${maxWidth}px`">
      <template v-for="item in getSearchList" :key="item.prop">
        <el-form-item :label="`${item.label} :`">
          <SearchFormItem :item="item" :searchParam="searchParam"></SearchFormItem>
        </el-form-item>
      </template>
    </el-form>
    <div class="search-operation">
      <el-button type="primary" :icon="Search" @click="search">Search</el-button>
      <el-button :icon="Delete" @click="reset">Reset</el-button>
      <el-button type="primary" link class="search-isOpen" @click="searchShow = !searchShow" v-if="columns.length > maxLength">
        {{ searchShow ? "Simple" : "Advanced" }}
        <el-icon class="el-icon--right">
          <component :is="searchShow ? ArrowUp : ArrowDown"></component>
        </el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="searchForm">
import { ref, computed, onMounted } from "vue";
import { ColumnProps } from "@/components/ProTable/interface/index";
import SearchFormItem from "./components/SearchFormItem.vue";
import { Delete, Search, ArrowDown, ArrowUp } from "@element-plus/icons-vue";

interface componentProps {
  columns: Partial<ColumnProps>[]; // Search configuration column
  searchParam: any; // Search parameter
  search: (params: any) => void; // Search method
  reset: (params: any) => void; // Reset
}

// Defaults
const props = withDefaults(defineProps<componentProps>(), {
  columns: () => [],
  searchParam: {}
});

const maxLength = ref<number>(4);
const maxWidth = ref<number>(1260);

onMounted(() => {
  // * Temporarily only judge these two situations (the fourth search item is time/date range || The first three existence time/date range selection box)
  // * In the later period, the adaptive width change of the text box through CSS has achieved the same style as Pro-Table in Antd, but the self-feel is not very good, so I don’t use
  if (props.columns.length >= 4) {
    const searchTypeArr = ["datetimerange", "daterange"];
    searchTypeArr.includes(props.columns[3].searchType!) ? ((maxWidth.value = 945), (maxLength.value = 3)) : null;
    props.columns.slice(0, 3).forEach(item => {
      searchTypeArr.includes(item.searchType!) ? ((maxWidth.value = 1155), (maxLength.value = 3)) : null;
    });
  }
});

// Whether to start search items
const searchShow = ref(false);

// Search item length based on whether to expand the configuration
const getSearchList = computed((): Partial<ColumnProps>[] => {
  if (searchShow.value) return props.columns;
  return props.columns.slice(0, maxLength.value);
});
</script>
