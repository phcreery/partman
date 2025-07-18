import { ref, computed } from "vue";

/**
 * @description 表格多选数据操作
 * @param {String} rowKey 当表格可以多选时，所指定的 id
 * */
export const useSelection = (rowKey: string = "id") => {
  const isSelected = ref<boolean>(false);
  const selectedList = ref<{ [key: string]: any }[]>([]);

  // 当前选中的所有 ids 数组
  const selectedListIds = computed((): string[] => {
    const ids: string[] = [];
    selectedList.value.forEach(item => ids.push(item[rowKey]));
    return ids;
  });

  /**
   * @description 多选操作
   * @param {Array} rowArr 当前选择的所有数据
   * @return void
   */
  const selectionChange = (rowArr: { [key: string]: any }[]) => {
    rowArr.length ? (isSelected.value = true) : (isSelected.value = false);
    selectedList.value = rowArr;
  };

  // Get row data for Key,Used to optimize Table The rendering of;When using multi-selection across pages,This attribute is required
  const getRowKeys = (row: any) => {
    return row[rowKey];
  };

  return {
    isSelected,
    selectedList,
    selectedListIds,
    selectionChange,
    getRowKeys
  };
};
