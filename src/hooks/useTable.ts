import { reactive, computed, toRefs } from "vue";
import { Pageable } from "@/components/ProTable/interface/index";

export interface StateProps {
  tableData: any[];
  pageable: Pageable;
  searchParam: IObject;
  searchInitParam: IObject;
  totalParam: IObject;
  icon?: IObject;
}

/**
 * @description Encapsulated table page operation methods
 * @param {Function} api API method to get table data (required)
 * @param {Object} initParam Initial parameters for fetching data (optional, default is {})
 * @param {Boolean} isPageable Whether to use pagination (optional, default is true)
 * @param {Function} dataCallBack Method to process the data returned from the backend (optional)
 * */
export const useTable = (
  api?: (_params: any) => Promise<any>,
  initParam: object = {},
  isPageable: boolean = true,
  dataCallBack?: (_data: any) => any,
  requestError?: (_error: any) => void
) => {
  const state = reactive<StateProps>({
    // Table data
    tableData: [],
    // Pagination data
    pageable: {
      // Current page number
      pageNum: 1,
      // Number of items per page
      pageSize: 25,
      // Total number of items
      total: 0
    },
    // Search parameters (only for queries)
    searchParam: {},
    // Initial default search parameters
    searchInitParam: {},
    // Total parameters (including pagination and search parameters)
    totalParam: {}
  });

  /**
   * @description Pagination query parameters (only includes pagination and table field sorting, other sorting methods can be configured as needed)
   * */
  const pageParam = computed({
    get: () => {
      return {
        // Customized for PocketBase
        // pageNum: state.pageable.pageNum,
        // pageSize: state.pageable.pageSize
        page: state.pageable.pageNum,
        perPage: state.pageable.pageSize
      };
    },
    set: (newVal: any) => {
      console.error("我是分页更新之后的值", newVal);
    }
  });

  /**
   * @description 获取表格数据
   * @return void
   * */
  const getTableList = async () => {
    if (!api) return;
    try {
      // 先把初始化参数和分页参数放到总参数里面
      Object.assign(state.totalParam, initParam, isPageable ? pageParam.value : {});
      let data = await api({ ...state.searchInitParam, ...state.totalParam });
      // console.log("data", data);
      dataCallBack && (data = dataCallBack(data));
      // console.log("data", data);
      state.tableData = isPageable ? data.list : data;
      // 解构后台返回的分页数据 (如果有分页更新分页信息)
      if (isPageable) {
        state.pageable.total = data.total;
      }
    } catch (error) {
      if (requestError) {
        requestError(error);
      } else {
        throw new Error(error as any);
      }
    }
  };

  /**
   * @description 更新查询参数
   * @return void
   * */
  const updatedTotalParam = () => {
    state.totalParam = {};
    // 处理查询参数，可以给查询参数加自定义前缀操作
    const nowSearchParam: StateProps["searchParam"] = {};
    // 防止手动清空输入框携带参数（这里可以自定义查询参数前缀）
    for (const key in state.searchParam) {
      // 某些情况下参数为 false/0 也应该携带参数
      if (state.searchParam[key] || state.searchParam[key] === false || state.searchParam[key] === 0) {
        nowSearchParam[key] = state.searchParam[key];
      }
    }

    // Customized for PocketBase
    Object.assign(state.totalParam, { filter: nowSearchParam }, isPageable ? pageParam.value : {});
  };

  /**
   * @description 表格数据查询
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
    // 重置搜索表单的时，如果有默认搜索参数，则重置默认的搜索参数
    state.searchParam = { ...state.searchInitParam };
    updatedTotalParam();
    getTableList();
  };

  /**
   * @description 每页条数改变
   * @param {Number} val 当前条数
   * @return void
   * */
  const handleSizeChange = (val: number) => {
    state.pageable.pageNum = 1;
    state.pageable.pageSize = val;
    getTableList();
  };

  /**
   * @description 当前页改变
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
    handleCurrentChange,
    updatedTotalParam
  };
};
