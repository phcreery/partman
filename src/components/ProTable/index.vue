<!-- 📚📚📚 Pro-Table 文档: https://juejin.cn/post/7166068828202336263 -->

<template>
  <!-- 查询表单 -->
  <search-form
    v-show="isShowSearch"
    :search="_search"
    :reset="_reset"
    :columns="searchColumns"
    :search-param="searchParam"
    :search-col="searchCol"
  />

  <!-- 表格主体 -->
  <div class="card table-main">
    <!-- 表格头部 操作按钮 -->
    <div class="table-header">
      <div class="header-button-lf">
        <slot
          name="tableHeader"
          :selected-list="selectedList"
          :selected-list-ids="selectedListIds"
          :is-selected="isSelected"
        ></slot>
      </div>
      <div v-if="toolButton" class="header-button-ri">
        <slot name="toolButton">
          <el-button v-if="showToolButton('refresh')" :icon="Refresh" circle @click="getTableList" />
          <el-button v-if="showToolButton('setting') && columns.length" :icon="Operation" circle @click="openColSetting" />
          <el-button
            v-if="showToolButton('search') && searchColumns?.length"
            :icon="Search"
            circle
            @click="isShowSearch = !isShowSearch"
          />
        </slot>
      </div>
    </div>
    <!-- 表格主体 -->
    <el-table
      v-bind="$attrs"
      :id="pageId"
      ref="tableRef"
      :data="processTableData"
      :border="border"
      :row-key="rowKey"
      @selection-change="selectionChange"
    >
      <!-- 默认插槽 -->
      <slot></slot>
      <template v-for="item in tableColumns" :key="item">
        <!-- selection || radio || index || expand || sort -->
        <el-table-column
          v-if="item.type && columnTypes.includes(item.type)"
          v-bind="item"
          :align="item.align ?? 'center'"
          :reserve-selection="item.type == 'selection'"
        >
          <template #default="scope">
            <!-- expand -->
            <template v-if="item.type == 'expand'">
              <component :is="item.render" v-bind="scope" v-if="item.render" />
              <slot v-else :name="item.type" v-bind="scope"></slot>
            </template>
            <!-- radio -->
            <el-radio v-if="item.type == 'radio'" v-model="radio" :value="scope.row[rowKey]">
              <i></i>
            </el-radio>
            <!-- sort -->
            <el-tag v-if="item.type == 'sort'" class="move">
              <el-icon> <DCaret /></el-icon>
            </el-tag>
          </template>
        </el-table-column>
        <!-- other -->
        <table-column v-else :column="item">
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" v-bind="scope"></slot>
          </template>
        </table-column>
      </template>
      <!-- 插入表格最后一行之后的插槽 -->
      <template #append>
        <slot name="append"></slot>
      </template>
      <!-- 无数据 -->
      <template #empty>
        <div class="table-empty">
          <slot name="empty">
            <img src="@/assets/images/notData.png" alt="notData" />
            <div>No Data</div>
          </slot>
        </div>
      </template>
    </el-table>
    <!-- 分页组件 -->
    <slot name="pagination">
      <pagination
        v-if="pagination"
        :pageable="pageable"
        :handle-size-change="handleSizeChange"
        :handle-current-change="handleCurrentChange"
      />
    </slot>
  </div>
  <!-- 列设置 -->
  <ColSetting v-if="toolButton" ref="colRef" v-model:col-setting="colSetting" />
</template>

<script setup lang="ts">
defineOptions({ name: "ProTable" });
import { ref, watch, provide, onMounted, unref, computed, reactive } from "vue";
import { ElTable } from "element-plus";
import { useTable } from "@/hooks/useTable";
import { useSelection } from "@/hooks/useSelection";
import type { ColumnProps, TypeProps, ProTableProps } from "@/components/ProTable/interface";
import { Refresh, Operation, Search } from "@element-plus/icons-vue";
import { handleProp } from "@/utils";
import SearchForm from "@/components/SearchForm/index.vue";
import Pagination from "./components/Pagination.vue";
import ColSetting from "./components/ColSetting.vue";
import TableColumn from "./components/TableColumn";
import Sortable from "sortablejs";

// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  requestAuto: true,
  pagination: true,
  initParam: () => ({}),
  border: true,
  toolButton: true,
  rowKey: "id",
  searchCol: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 })
});

if (!props.pageAuthId) {
  throw new Error("Please configure [pageAuthId]");
}

const pageId = computed(() => `id-${props.pageAuthId.replaceAll(":", "_")}`);

// table 实例
const tableRef = ref<InstanceType<typeof ElTable>>();

// column 列类型
const columnTypes: TypeProps[] = ["selection", "radio", "index", "expand", "sort"];

// 是否显示搜索模块
const isShowSearch = ref(true);

// 控制 ToolButton 显示
const showToolButton = (key: "refresh" | "setting" | "search") => {
  return Array.isArray(props.toolButton) ? props.toolButton.includes(key) : props.toolButton;
};

// 单选值
const radio = ref("");

// 表格多选 Hooks
const { selectionChange, selectedList, selectedListIds, isSelected } = useSelection(props.rowKey);

// 表格操作 Hooks
const { tableData, pageable, searchParam, searchInitParam, getTableList, search, reset, handleSizeChange, handleCurrentChange } =
  useTable(props.requestApi, props.initParam, props.pagination, props.dataCallback, props.requestError);

// 清空选中数据列表
const clearSelection = () => tableRef.value!.clearSelection();

// 初始化表格数据 && 拖拽排序
onMounted(() => {
  dragSort();
  props.requestAuto && getTableList();
  props.data && (pageable.value.total = props.data.length);
});

// 处理表格数据
const processTableData = computed(() => {
  if (!props.data) return tableData.value;
  if (!props.pagination) return props.data;
  return props.data.slice(
    (pageable.value.pageNum - 1) * pageable.value.pageSize,
    pageable.value.pageSize * pageable.value.pageNum
  );
});

// 监听页面 initParam 改化，重新获取表格数据
watch(() => props.initParam, getTableList, { deep: true });

// 接收 columns 并设置为响应式
const tableColumns = reactive<ColumnProps[]>(props.columns);

// 扁平化 columns
const flatColumns = computed(() => flatColumnsFunc(tableColumns));

// 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充搜索下拉选择）
const enumMap = ref(new Map<string, { [key: string]: any }[]>());
const setEnumMap = async ({ prop, enum: enumValue }: ColumnProps) => {
  if (!enumValue) return;

  // 如果当前 enumMap 存在相同的值 return
  if (enumMap.value.has(prop!) && (typeof enumValue === "function" || enumMap.value.get(prop!) === enumValue)) return;

  // 当前 enum 为静态数据，则直接存储到 enumMap
  if (typeof enumValue !== "function") return enumMap.value.set(prop!, unref(enumValue!));

  // 为了防止接口执行慢，而存储慢，导致重复请求，所以预先存储为[]，接口返回后再二次存储
  enumMap.value.set(prop!, []);

  // 当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
  const data = await enumValue();

  enumMap.value.set(prop!, data);
};

// 注入 enumMap
provide("enumMap", enumMap);

// 扁平化 columns 的方法
const flatColumnsFunc = (columns: ColumnProps[], flatArr: ColumnProps[] = []) => {
  columns.forEach(async col => {
    if (col._children?.length) flatArr.push(...flatColumnsFunc(col._children));
    flatArr.push(col);

    // column 添加默认 isShow && isSetting && isFilterEnum 属性值
    col.isShow = col.isShow ?? true;
    col.isSetting = col.isSetting ?? true;
    col.isFilterEnum = col.isFilterEnum ?? true;

    // 设置 enumMap
    await setEnumMap(col);
  });
  return flatArr.filter(item => !item._children?.length);
};

// 过滤需要搜索的配置项 && 排序
const searchColumns = computed(() => {
  return flatColumns.value
    ?.filter(item => item.search?.el || item.search?.render)
    .sort((a, b) => a.search!.order! - b.search!.order!);
});

// 设置 搜索表单默认排序 && 搜索表单项的默认值
searchColumns.value?.forEach((column, index) => {
  column.search!.order = column.search?.order ?? index + 2;
  const key = column.search?.key ?? handleProp(column.prop!);
  const defaultValue = column.search?.defaultValue;
  if (defaultValue !== undefined && defaultValue !== null) {
    searchParam.value[key] = defaultValue;
    searchInitParam.value[key] = defaultValue;
  }
});

// 列设置 ==> 需要过滤掉不需要设置的列
const colRef = ref();
const colSetting = tableColumns!.filter(item => {
  const { type, prop, isSetting } = item;
  return !columnTypes.includes(type!) && prop !== "operation" && isSetting;
});
const openColSetting = () => colRef.value.openColSetting();

// 定义 emit 事件
const emit = defineEmits<{
  search: [];
  reset: [];
  dragSort: [{ newIndex?: number; oldIndex?: number }];
}>();

const _search = () => {
  search();
  emit("search");
};

const _reset = () => {
  reset();
  emit("reset");
};

// 表格拖拽排序
const dragSort = () => {
  const tbody = document.querySelector(`#${pageId.value} tbody`) as HTMLElement;
  Sortable.create(tbody, {
    handle: ".move",
    animation: 300,
    onEnd({ newIndex, oldIndex }) {
      const [removedItem] = processTableData.value.splice(oldIndex!, 1);
      processTableData.value.splice(newIndex!, 0, removedItem);
      emit("dragSort", { newIndex, oldIndex });
    }
  });
};

// 暴露给父组件的参数和方法
defineExpose({
  element: tableRef,
  tableData: processTableData,
  radio,
  pageable,
  searchParam,
  searchInitParam,
  isSelected,
  selectedList,
  selectedListIds,
  tableColumns,

  getTableList,
  search,
  reset,
  handleSizeChange,
  handleCurrentChange,
  clearSelection,
  enumMap
});
</script>
