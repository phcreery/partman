import type { VNode, ComponentPublicInstance, Ref } from "vue";
import type { BreakPoint, Responsive } from "@/components/Grid/interface";
import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import type ProTable from "@/components/ProTable/index.vue";
import type { ColProps, DialogProps, DrawerProps, FormItemRule, FormProps } from "element-plus";
import type { ResList } from "@/api/interface/index";

export interface EnumProps {
  label?: string; // The text displayed for the option
  value?: string | number | boolean | any[]; // The value of the option
  disabled?: boolean; // Whether this option is disabled
  tagType?: string; // When tag is true, this specifies the tag display type
  children?: EnumProps[]; // For tree selection, use children to specify sub-options
  [key: string]: any;
}

export type TypeProps = "index" | "selection" | "radio" | "expand" | "sort";

export type SearchType =
  | "input"
  | "input-number"
  | "select"
  | "select-v2"
  | "tree-select"
  | "cascader"
  | "date-picker"
  | "time-picker"
  | "time-select"
  | "switch"
  | "slider";

export type SearchRenderScope = {
  searchParam: { [key: string]: any };
  placeholder: string;
  clearable: boolean;
  options: EnumProps[];
  data: EnumProps[];
};

export type SearchProps = {
  el?: SearchType; // The type of the search field for this item
  label?: string; // The label for the search field
  props?: any; // Search item parameters, passed according to Element Plus documentation, all values will be passed through to the component
  key?: string; // If the search item key is not the prop attribute, you can specify it with key
  tooltip?: string; // Search tooltip
  order?: number; // Search item order (from high to low)
  span?: number; // Number of columns the search item occupies, default is 1 column
  offset?: number; // Number of columns to offset to the left for the search field
  defaultValue?: string | number | boolean | any[] | Ref<any>; // Default value for the search item
  render?: (_scope: SearchRenderScope) => VNode; // Custom search content rendering (tsx syntax)
} & Partial<Record<BreakPoint, Responsive>>;

export type FieldNamesProps = {
  label: string;
  value: string;
  children?: string;
};

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

export interface Pageable {
  pageNum: number;
  pageSize: number;
  total: number;
}

export interface PageableList<T = any> extends Pageable {
  list: T[];
}

export interface ColumnProps<T = any>
  extends Partial<Omit<TableColumnCtx<T>, "type" | "children" | "renderCell" | "renderHeader">> {
  type?: TypeProps; // 列类型
  tag?: boolean | Ref<boolean>; // 是否是标签展示
  isShow?: boolean | Ref<boolean>; // 是否显示在表格当中
  isSetting?: boolean | Ref<boolean>; // 是否在 ColSetting 中可配置
  search?: SearchProps | undefined; // 搜索项配置
  enum?: EnumProps[] | Ref<EnumProps[]> | ((_params?: any) => Promise<any>); // 枚举字典
  isFilterEnum?: boolean | Ref<boolean>; // 当前单元格值是否根据 enum 格式化（示例：enum 只作为搜索项数据）
  fieldNames?: FieldNamesProps; // 指定 label && value && children 的 key 值
  headerRender?: (_scope: HeaderRenderScope<T>) => VNode; // 自定义表头内容渲染（tsx语法）
  render?: (_scope: RenderScope<T>) => VNode | string; // 自定义单元格内容渲染（tsx语法）
  _children?: ColumnProps<T>[]; // 多级表头
}

export type ProTableInstance = Omit<InstanceType<typeof ProTable>, keyof ComponentPublicInstance | keyof ProTableProps>;

export interface ProTableProps<Q = any, I = any> {
  pageAuthId: string;
  columns: ColumnProps<I>[]; // Column configuration items ==> required
  data?: I[]; // Static table data. If present, requestApi's data will not be used ==> optional
  requestApi?: (_params: Q) => Promise<ResList<I>>; // API to request table data ==> optional
  requestAuto?: boolean; // Whether to automatically execute the request API ==> optional (default: true)
  requestError?: (_params: any) => void; // Table API request error listener ==> optional
  dataCallback?: (_data: any) => I[] | PageableList<I>; // Callback function for returned data, can be used to process data ==> optional
  title?: string; // Table title ==> optional
  pagination?: boolean; // Whether to show pagination component ==> optional (default: true)
  initParam?: Partial<Q>; // Initial request parameters ==> optional (default: {})
  border?: boolean; // Whether to show vertical borders ==> optional (default: true)
  toolButton?: ("refresh" | "setting" | "search")[] | boolean; // Whether to show table tool buttons ==> optional (default: true)
  rowKey?: string; // Row data key, used to optimize Table rendering, and as the id for multi-select ==> optional (default: id)
  searchCol?: number | Record<BreakPoint, number>; // Table search item column span configuration ==> optional { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
}

type DateComponent = "date-picker" | "time-picker" | "time-select" | "custom-tag" | "input-tag";
type InputComponent = "input" | "select" | "input-number" | "cascader" | "tree-select";
type OtherComponent = "text" | "radio" | "checkbox" | "switch" | "icon-select" | "custom";

export type IComponentType = DateComponent | InputComponent | OtherComponent;

export type IFormItems<T = IComponentType> = Array<{
  // 组件类型(如input,select,radio,custom等)
  type: T;
  // 标签提示
  tips?: string | IObject;
  // 标签文本
  label: string;
  // 键名
  prop: string;
  // 组件属性
  attrs?: IObject;
  // 组件可选项(只适用于select,radio,checkbox组件)
  options?: Array<{ label: string; value: any; [key: string]: any }> | Ref<any[]>;
  // 验证规则
  rules?: FormItemRule[];
  // 初始值
  initialValue?: any;
  // 插槽名(适用于自定义组件，设置类型为custom)
  slotName?: string;
  // 是否隐藏
  hidden?: boolean;
  // layout组件Col属性
  col?: Partial<ColProps>;
  // 组件事件
  events?: Record<string, (..._args: any) => void>;
  // 初始化数据函数扩展
  initFn?: (_item: IObject) => void;
}>;

type IForm = Partial<Omit<FormProps, "model" | "rules">>;

export interface IModalConfig<T = any> {
  // 权限前缀(如sys:user，用于组成权限标识)，不提供则不进行权限校验
  permPrefix?: string;
  // 标签冒号(默认：false)
  colon?: boolean;
  // 主键名(主要用于编辑数据,默认为id)
  pk?: string;
  // 组件类型(默认：dialog)
  component?: "dialog" | "drawer";
  // dialog组件属性
  dialog?: Partial<Omit<DialogProps, "modelValue">>;
  // drawer组件属性
  drawer?: Partial<Omit<DrawerProps, "modelValue">>;
  // form组件属性
  form?: IForm;
  // 表单项
  formItems: IFormItems<IComponentType>;
  // 提交之前处理
  beforeSubmit?: (_data: T) => void;
  // 提交的网络请求函数(需返回promise)
  formAction?: (_data: T) => Promise<any>;
}
