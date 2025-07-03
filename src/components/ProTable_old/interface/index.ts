import { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import { BreakPoint, Responsive } from "@/components/Grid/interface";
import type { VNode, ComponentPublicInstance, Ref } from "vue";

export interface EnumProps {
  label: string; // Text displayed in the option box
  value: any; // Optional value
  childrenKey?: string; // key to search children
  disabled?: boolean; // Whether to disable this option
  tagType?: string; // When tag is true, this choice will specify the TAG display type
  children?: EnumProps[]; // When choosing for tree shape, you can pass children Properties specified sub -options
  [key: string]: any;
}

export type SearchType =
  | "input"
  | "select"
  | "tree-select"
  | "cascader"
  | "date-picker"
  | "time-picker"
  | "time-select"
  | "switch";

export type SearchProps = {
  el: SearchType; // Types of the current item search box
  props?: any; // 搜索项参数，根据 element plus 官方文档来传递，该属性所有值会透传到组件
  key?: string; // 当搜索项 key 不为 prop 属性时，可通过 key 指定
  order?: number; // 搜索项排序（从大到小）
  span?: number; // 搜索项所占用的列数，默认为1列
  offset?: number; // 搜索字段左侧偏移列数
  defaultValue?: string | number | boolean | any[]; // 搜索项默认值
} & Partial<Record<BreakPoint, Responsive>>;

export type TypeProp = "index" | "selection" | "expand";

export type FixedProp = "left" | "right";

export type RenderScope<T> = {
  row: T;
  $index: number;
  column: TableColumnCtx<T>;
  [key: string]: any;
};
export type HeaderRenderScope<T> = {
  $index: number;
  column: TableColumnCtx<T>;
  [key: string]: any;
};

export interface ColumnProps<T = any>
  extends Partial<Omit<TableColumnCtx<T>, "type" | "children" | "renderHeader" | "renderCell">> {
  type?: TypeProp; // 列类型
  tag?: boolean | Ref<boolean>; // 是否是标签展示
  isShow?: boolean | Ref<boolean>; // 是否显示在表格当中
  search?: SearchProps | undefined; // 搜索项配置
  enum?: EnumProps[] | ((params?: any) => Promise<any>); // 枚举类型（渲染值的字典）
  isFilterEnum?: boolean | Ref<boolean>; // 当前单元格值是否根据 enum 格式化（示例：enum 只作为搜索项数据）
  fieldNames?: { label: string; value: string }; // 指定 label && value 的 key 值
  headerRender?: (_scope: HeaderRenderScope<T>) => VNode; // 自定义表头内容渲染（tsx语法）
  render?: (_scope: RenderScope<T>) => VNode | string; // 自定义单元格内容渲染（tsx语法）
  _children?: ColumnProps<T>[]; // 多级表头
}

// interface ProTableProps extends Partial<Omit<TableProps<any>, "data">> {
//   columns: ColumnProps[]; // 列配置项
//   requestApi: (params: any) => Promise<any>; // 请求表格数据的api ==> 必传
//   dataCallback?: (data: any) => any; // 返回数据的回调函数，可以对数据进行处理 ==> 非必传
//   title?: string; // 表格标题，目前只在打印的时候用到 ==> 非必传
//   pagination?: boolean; // 是否需要分页组件 ==> 非必传（默认为true）
//   initParam?: any; // 初始化请求参数 ==> 非必传（默认为{}）
//   border?: boolean; // 是否带有纵向边框 ==> 非必传（默认为true）
//   toolButton?: boolean; // 是否显示表格功能按钮 ==> 非必传（默认为true）
//   selectId?: string; // 当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
//   searchCol?: number | Record<BreakPoint, number>; // 表格搜索项 每列占比配置 ==> 非必传 { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
// }

export interface ProTableProps<Q = any, I = any> {
  pageAuthId: string;
  columns: ColumnProps<I>[]; // 列配置项  ==> 必传
  data?: I[]; // 静态 table data 数据，若存在则不会使用 requestApi 返回的 data ==> 非必传
  requestApi?: (_params: Q) => Promise<ResultPage<I>>; // 请求表格数据的 api ==> 非必传
  requestAuto?: boolean; // 是否自动执行请求 api ==> 非必传（默认为true）
  requestError?: (_params: any) => void; // 表格 api 请求错误监听 ==> 非必传
  dataCallback?: (_data: any) => any; // 返回数据的回调函数，可以对数据进行处理 ==> 非必传
  title?: string; // 表格标题 ==> 非必传
  pagination?: boolean; // 是否需要分页组件 ==> 非必传（默认为true）
  initParam?: Partial<Q>; // 初始化请求参数 ==> 非必传（默认为{}）
  border?: boolean; // 是否带有纵向边框 ==> 非必传（默认为true）
  toolButton?: ("refresh" | "setting" | "search")[] | boolean; // 是否显示表格功能按钮 ==> 非必传（默认为true）
  rowKey?: string; // 行数据的 Key，用来优化 Table 的渲染，当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
  searchCol?: number | Record<BreakPoint, number>; // 表格搜索项 每列占比配置 ==> 非必传 { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
}
