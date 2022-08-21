import { ref, computed } from "vue";

/**
 * @description Form multi -selected data operation
 * */
export const useSelection = () => {
	// Whether to select data
	const isSelected = ref<boolean>(false);
	// Selected data list
	const selectedList = ref([]);

	// All IDs currently selected(Array), You can configure the ID field according to the project yourself
	const selectedListIds = computed((): string[] => {
		let ids: string[] = [];
		selectedList.value.forEach(item => {
			ids.push(item["id"]);
		});
		return ids;
	});

	// Obtaining data Key,To optimize Table Rendering;When using multi -choice of pages,This attribute is necessary
	const getRowKeys = (row: { id: string }) => {
		return row.id;
	};

	/**
	 * @description Multi -choice operation
	 * @param {Array} rowArr All the data currently selected
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
