<!-- 📚📚📚 Pro-Table Documentation: https://juejin.cn/post/7094890833064755208 -->
<!-- 💢💢💢 In the later period, the Pro-Table component will be reconstructed. -->

<template>
  <div class="table-box">
    <!-- Query form -->
    <SearchForm
      :search="search"
      :reset="reset"
      :searchParam="searchParam"
      :columns="searchColumns"
      v-show="isShowSearch"
    ></SearchForm>
    <!-- Header Operation button -->
    <div class="table-header">
      <div class="header-button-lf">
        <slot name="tableHeader" :ids="selectedListIds" :isSelected="isSelected"></slot>
      </div>
      <div class="header-button-ri" v-if="toolButton">
        <el-button-group>
          <el-button :icon="Refresh" @click="refresh"> </el-button>
          <el-button :icon="Operation" @click="openColSetting"> </el-button>
          <el-button :icon="Filter" v-if="searchColumns.length" @click="isShowSearch = !isShowSearch"> Filter </el-button>
        </el-button-group>
      </div>
    </div>
    <!-- Tabletop -->
    <el-table
      ref="tableRef"
      :data="tableData"
      :border="border"
      @selection-change="selectionChange"
      :row-key="getRowKeys"
      :stripe="stripe"
      :tree-props="{ children: childrenName }"
    >
      <template v-for="item in tableColumns" :key="item">
        <!-- selection || index -->
        <el-table-column
          v-if="item.type == 'selection' || item.type == 'index'"
          :type="item.type"
          :reserve-selection="item.type == 'selection'"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
          :fixed="item.fixed"
          :align="'center'"
        >
        </el-table-column>
        <!-- Expand (Expand viewing details, please use the domain slot) -->
        <el-table-column
          v-if="item.type == 'expand'"
          :type="item.type"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
          :fixed="item.fixed"
          v-slot="scope"
          :align="item.align ?? 'center'"
        >
          <slot :name="item.type" :row="scope.row"></slot>
        </el-table-column>
        <!-- other -->
        <el-table-column
          v-if="!item.type && item.prop && item.isShow"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
          :sortable="item.sortable"
          :show-overflow-tooltip="item.prop !== 'action'"
          :resizable="true"
          :fixed="item.fixed"
          :align="item.align ?? 'center'"
        >
          <!-- Custom Header (using components to render TSX syntax) -->
          <template #header v-if="item.renderHeader">
            <component :is="item.renderHeader" :row="item"> </component>
          </template>

          <!-- Customize the configuration of each column SLOT (using the domain slot) -->
          <template #default="scope">
            <slot :name="item.prop" :row="scope.row">
              <!-- picture(Preview) -->
              <el-image
                v-if="item.image"
                :src="scope.row[item.prop!]"
                :preview-src-list="[scope.row[item.prop!]]"
                fit="cover"
                class="table-image"
                preview-teleported
              />
              <!-- tag Tags (with formatting content) -->
              <el-tag v-else-if="item.tag" :type="filterEnum(scope.row[item.prop!], item.enum!, item.searchProps,'tag')">
                {{
                  item.enum?.length
                    ? filterEnum(scope.row[item.prop!], item.enum!, item.searchProps)
                    : formatValue(scope.row[item.prop!])
                }}
              </el-tag>
              <!-- Text (comes with formatting content) -->
              <span v-else-if="typeof item.renderText === 'function'">
                <!-- {{ item.textRender(scope.row) }} -->
                {{
                  item.enum?.length
                    ? filterEnum(item.renderText(scope.row), item.enum!, item.searchProps)
                    : formatValue(item.renderText(scope.row))
                }}
              </span>
              <span v-else>
                {{
                  item.enum?.length
                    ? filterEnum(scope.row[item.prop!], item.enum!, item.searchProps)
                    : formatValue(scope.row[item.prop!])
                }}
              </span>
            </slot>
          </template>
        </el-table-column>
      </template>
      <template #empty>
        <div class="table-empty">
          <img src="@/assets/images/notData.png" alt="notData" />
          <div>No data</div>
        </div>
      </template>
    </el-table>
    <!-- Pagination -->
    <Pagination
      v-if="pagination"
      :pageable="pageable"
      :handleSizeChange="handleSizeChange"
      :handleCurrentChange="handleCurrentChange"
    ></Pagination>
    <!-- Column settings -->
    <ColSetting v-if="toolButton" ref="colRef" :tableRef="tableRef" :colSetting="colSetting"></ColSetting>
  </div>
</template>

<script setup lang="ts" name="component">
import { ref, watch } from "vue";
import { useTable } from "@/hooks/useTable";
import { useSelection } from "@/hooks/useSelection";
import { Refresh, Operation, Filter } from "@element-plus/icons-vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { filterEnum, formatValue } from "@/utils/util";
import SearchForm from "@/components/SearchForm/index.vue";
import Pagination from "@/components/ProTable/components/Pagination.vue";
import ColSetting from "./components/ColSetting.vue";

// Form DOM element
const tableRef = ref();

// Whether to display the search module
const isShowSearch = ref<boolean>(false);

interface componentProps {
  columns: Partial<ColumnProps>[]; // Column configuration item
  requestApi: (params: any) => Promise<any>; // API ==> must be passed on the request form data
  dataCallback?: (data: any) => any; // The callback function of the data can be processed on the data
  pagination?: boolean; // Do you need a paging component ==> Non -pass (default)
  initParam?: any; // Initialize request parameters ==> Non -Perminal (Faculty {})
  border?: boolean; // Whether the table display is displayed ==> Non -pass (default)
  stripe?: boolean; // Whether to bring zebra pattern table ==> Non -component (default False)
  toolButton?: boolean; // Whether the table function button is displayed ==> Non -pass (default TRUE)
  childrenName?: string; // When the data exists in children, specify the children key name ==> Non -component (default "children")
}

// Accept the parent component parameter, configure the default value
const props = withDefaults(defineProps<componentProps>(), {
  columns: () => [],
  pagination: true,
  initParam: {},
  border: true,
  stripe: false,
  toolButton: true,
  childrenName: "children"
});

// Multi -choice of forms Hooks
const { selectionChange, getRowKeys, selectedListIds, isSelected } = useSelection();

// Table operation Hooks
const { tableData, pageable, searchParam, searchInitParam, getTableList, search, reset, handleSizeChange, handleCurrentChange } =
  useTable(props.requestApi, props.initParam, props.pagination, props.dataCallback);

// The monitoring page Initparam is modified, and the table data is re -obtained
watch(
  () => props.initParam,
  () => {
    getTableList();
  },
  { deep: true }
);

// Table column configuration item processing (add iSSHOW property, control display/hidden)
const tableColumns = ref<Partial<ColumnProps>[]>();
tableColumns.value = props.columns.map(item => {
  return {
    ...item,
    isShow: item.isShow ?? true
  };
});

// If the current enum needs to request data in the background data, call the request interface to get the enum data
tableColumns.value.forEach(async item => {
  if (item.enumFunction && typeof item.enumFunction === "function") {
    const { data } = await item.enumFunction();
    item.enum = data;
  }
  if (item.enumTreeFunction && typeof item.enumTreeFunction === "function") {
    const { data } = await item.enumTreeFunction();
    item.enumTree = data;
  }
});

// Filter the configuration items that need to be search
const searchColumns = tableColumns.value.filter(item => item.search);
// Set the default value of the search form
searchColumns.forEach(column => {
  if (column.searchInitParam !== undefined && column.searchInitParam !== null) {
    searchInitParam.value[column.prop!] = column.searchInitParam;
  }
});

// * Column settings
const colRef = ref();
// Filtering does not need to be set up with hidden columns
const colSetting = tableColumns.value.filter((item: Partial<ColumnProps>) => {
  return (
    item.type !== "selection" &&
    item.type !== "index" &&
    item.type !== "expand" &&
    item.prop !== "operation" &&
    item.isShow !== false
  );
});
const openColSetting = () => {
  colRef.value.openColSetting();
};

const refresh = () => {
  tableRef.value!.clearSelection();
  getTableList();
};

// Parameters and methods exposed to parent components
defineExpose({ searchParam, refresh, tableColumns });
</script>
