import { ref, computed } from "vue";

/**
 * @description Form multiple selection data manipulation
 * @param {String} selectId When the form可以多选时，The specified id
 * @param {Any} tableRef 当表格 ref
 * */
export const useSelection = (selectId: string = "id") => {
	// Whether data is selected or not
	const isSelected = ref<boolean>(false);
	// List of selected data
	const selectedList = ref([]);

	// All currently selectedids(Arrays)，Can be configured according to the project itselfidFields
	const selectedListIds = computed((): string[] => {
		let ids: string[] = [];
		selectedList.value.forEach(item => {
			ids.push(item[selectId]);
		});
		return ids;
	});

	// Get row data for Key,Used to optimize Table The rendering of;When using multi-selection across pages,This attribute is required
	const getRowKeys = (row: any) => {
		return row[selectId];
	};

	/**
	 * @description Multi-select operation
	 * @param {Array} rowArr All data currently selected
	 * @return void
	 */
	const selectionChange = (rowArr: any) => {
		rowArr.length === 0 ? (isSelected.value = false) : (isSelected.value = true);
		selectedList.value = rowArr;
	};

	return {
		isSelected,
		selectedList,
		selectedListIds,
		selectionChange,
		getRowKeys
	};
};
