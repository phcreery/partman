import { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import { BreakPoint, Responsive } from "@/components/Grid/interface";

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

export interface ColumnProps<T = any> extends Partial<Omit<TableColumnCtx<T>, "children" | "renderHeader" | "renderCell">> {
  tag?: boolean; // 是否是标签展示
  isShow?: boolean; // 是否显示在表格当中
  search?: SearchProps | undefined; // 搜索项配置
  enum?: EnumProps[] | ((params?: any) => Promise<any>); // 枚举类型（渲染值的字典）
  isFilterEnum?: boolean; // 当前单元格值是否根据 enum 格式化（示例：enum 只作为搜索项数据）
  fieldNames?: { label: string; value: string }; // 指定 label && value 的 key 值
  headerRender?: (row: ColumnProps) => any; // 自定义表头内容渲染（tsx语法）
  render?: (scope: { row: T }) => any; // 自定义单元格内容渲染（tsx语法）
  _children?: ColumnProps<T>[]; // 多级表头
}
