import { Table } from "./interface";
import { reactive, computed, onMounted, toRefs } from "vue";
import { nestedObjectAssign } from "@/utils/util";
/**
 * @description table Page operation method packaging
 * @param {Function} api Get the table data API method (must be passed)
 * @param {Object} initParam Get the data initialization parameter (non -component, default {})
 * @param {Boolean} isPageable Whether there are paginations (non -must be passed, the default is true)
 * @param {Function} dataCallBack How to process the data returned in the background (non -compulsory)
 * */
export const useTable = (
  api: (params: any) => Promise<any>,
  initParam: object = {},
  isPageable: boolean = true,
  dataCallBack?: (data: any) => any
) => {
  const state = reactive<Table.TableStateProps>({
    // Table data
    tableData: [],
    // Pagination data
    pageable: {
      // current page number
      pageNum: 1,
      // Display number per page
      pageSize: 25,
      // Total number
      total: 0
    },
    // Query parameters (including only query)
    searchParam: {},
    // Initialize the default query parameter
    searchInitParam: {},
    // Total parameters (including pagination and query parameters)
    totalParam: {}
  });

  /**
   * @description Pagling query parameters (only include pagination and table field sorting, other sorting methods can be configured by yourself)
   * */
  const pageParam = computed({
    get: () => {
      return {
        page: state.pageable.pageNum,
        perPage: state.pageable.pageSize
      };
    },
    set: (newVal: any) => {
      console.log("I am the value after the pagination update", newVal);
    }
  });

  // What needs to be done when initialization is to set the form query default value && obtain form data (the role of the RESET function is exactly these two functions)
  onMounted(() => {
    reset();
  });

  /**
   * @description Get the table data
   * @return void
   * */
  const getTableList = async () => {
    try {
      // First put the initialization parameter and pagination parameter in the total parameter
      nestedObjectAssign(state.totalParam, initParam, isPageable ? pageParam.value : {});
      let { data } = await api(state.totalParam);
      dataCallBack && (data = dataCallBack(data));
      state.tableData = isPageable ? data.datalist : data;
      // Practical pagination data returned in the background (if there is a pagination update pagination information)
      const { pageNum, pageSize, total } = data;
      isPageable && updatePageable({ pageNum, pageSize, total });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * @description Update query parameters
   * @return void
   * */
  const updatedTotalParam = () => {
    state.totalParam = {};
    // Process query parameters, you can add a custom prefix operation to the query parameter
    let nowSearchParam: { [propName: string]: any } = {};
    // Prevent the parameter of the manual clearance input box (here you can customize query parameters prefix)
    for (let key in state.searchParam) {
      // * In some cases, parameters are false/0 You should also carry parameters
      if (state.searchParam[key] || state.searchParam[key] === false || state.searchParam[key] === 0) {
        nowSearchParam[key] = state.searchParam[key];
      }
    }
    Object.assign(state.totalParam, { filter: nowSearchParam }, isPageable ? pageParam.value : {});
  };

  /**
   * @description Update pagination information
   * @param {Object} resPageable Practical data returned in the background
   * @return void
   * */
  const updatePageable = (resPageable: Table.Pageable) => {
    Object.assign(state.pageable, resPageable);
  };

  /**
   * @description Form data query
   * @return void
   * */
  const search = () => {
    state.pageable.pageNum = 1;
    updatedTotalParam();
    getTableList();
  };

  /**
   * @description 表格数据重置
   * @return void
   * */
  const reset = () => {
    state.pageable.pageNum = 1;
    state.searchParam = {};
    // When resetting the search form, if there is a default search parameter, reset the default search parameter
    Object.keys(state.searchInitParam).forEach(key => {
      state.searchParam[key] = state.searchInitParam[key];
      // Object.assign(state.searchParam[key], state.searchInitParam[key]);
    });
    updatedTotalParam();
    getTableList();
  };

  /**
   * @description Each page number changes
   * @param {Number} val Current number
   * @return void
   * */
  const handleSizeChange = (val: number) => {
    state.pageable.pageNum = 1;
    state.pageable.pageSize = val;
    getTableList();
  };

  /**
   * @description Current page change
   * @param {Number} val current page
   * @return void
   * */
  const handleCurrentChange = (val: number) => {
    state.pageable.pageNum = val;
    getTableList();
  };

  return {
    ...toRefs(state),
    getTableList,
    search,
    reset,
    handleSizeChange,
    handleCurrentChange
  };
};
