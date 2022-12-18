import { Table } from "./interface";
import { reactive, computed, onMounted, toRefs } from "vue";

/**
 * @description table 页面操作Methods封装
 * @param {Function} api Get table data api 方法(Must Pass)
 * @param {Object} initParam Get data initialization parameters(Not a must pass，Default is{})
 * @param {Boolean} isPageable With or without pagination(Not a must pass，Default istrue)
 * @param {Function} dataCallBack Methods for processing the data returned by the backend(Not a must pass)
 * */
export const useTable = (
  api: (params: any) => Promise<any>,
  initParam: object = {},
  isPageable: boolean = true,
  dataCallBack?: (data: any) => any
) => {
  const state = reactive<Table.TableStateProps>({
    // Table Data
    tableData: [],
    // Paging Data
    pageable: {
      // Current page数
      pageNum: 1,
      // Number of bars per page
      pageSize: 25,
      // Total number of articles
      total: 0
    },
    // Query Parameters(Include only queries)
    searchParam: {},
    // Initialize the default query parameters
    searchInitParam: {},
    // Total Parameters(Include paging and query parameters)
    totalParam: {}
  });

  /**
   * @description Paging query parameters(Includes paging and form field sorting only,Other sorting methods can be configured by yourself)
   * */
  const pageParam = computed({
    get: () => {
      return {
        page: state.pageable.pageNum,
        perPage: state.pageable.pageSize
      };
    },
    set: (newVal: any) => {
      console.log("I am the value after the paging update", newVal);
    }
  });

  // All that needs to be done at the time of initialization is Set form query defaults && Get table data(resetThe function does exactly these two functions)
  onMounted(() => {
    reset();
  });

  /**
   * @description Get table data
   * @return void
   * */
  const getTableList = async () => {
    try {
      // First put the initialization parameters and paging parameters into the total parameters
      Object.assign(state.totalParam, initParam, isPageable ? pageParam.value : {});
      let { data } = await api(state.totalParam);
      dataCallBack && (data = dataCallBack(data));
      state.tableData = isPageable ? data.datalist : data;
      // 解构Paging data returned by the backend (如果有分页Update paging information)
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
    // Handling query parameters，You can add custom prefix operations to query parameters
    let nowSearchParam: { [key: string]: any } = {};
    // Prevent manual emptying of input boxes to carry parameters（Here you can customize the query parameter prefix）
    for (let key in state.searchParam) {
      // * In some cases the parameters are false/0 should also carry the parameter
      if (state.searchParam[key] || state.searchParam[key] === false || state.searchParam[key] === 0) {
        nowSearchParam[key] = state.searchParam[key];
      }
    }
    Object.assign(state.totalParam, { filter: nowSearchParam }, isPageable ? pageParam.value : {});
  };

  /**
   * @description 更新分页信息
   * @param {Object} resPageable 后台返回的分页数据
   * @return void
   * */
  const updatePageable = (resPageable: Table.Pageable) => {
    Object.assign(state.pageable, resPageable);
  };

  /**
   * @description Form Data Inquiry
   * @return void
   * */
  const search = () => {
    state.pageable.pageNum = 1;
    updatedTotalParam();
    getTableList();
  };

  /**
   * @description Form Data Reset
   * @return void
   * */
  const reset = () => {
    state.pageable.pageNum = 1;
    state.searchParam = {};
    // When resetting the search form，If there are default search parameters，then reset the default search parameters
    Object.keys(state.searchInitParam).forEach(key => {
      state.searchParam[key] = state.searchInitParam[key];
    });
    updatedTotalParam();
    getTableList();
  };

  /**
   * @description Number of entries per page change
   * @param {Number} val Current bar count
   * @return void
   * */
  const handleSizeChange = (val: number) => {
    state.pageable.pageNum = 1;
    state.pageable.pageSize = val;
    getTableList();
  };

  /**
   * @description Current page change
   * @param {Number} val 当前页
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
