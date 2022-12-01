export interface EnumProps {
  label: string; // Text displayed in the option box
  value: any; // Optional value
  disabled?: boolean; // Whether to disable this option
  tagType?: string; // When tag is true, this choice will specify the TAG display type
  children?: EnumProps[]; // When choosing for tree shape, you can pass children Properties specified sub -options
  [key: string]: any;
}

export type SearchType =
  | "text"
  | "select"
  | "multipleSelect"
  | "treeSelect"
  | "multipleTreeSelect"
  | "date"
  | "daterange"
  | "timerange"
  | "datetimerange";

export type TypeProp = "index" | "selection" | "expand";

export type FixedProp = "left" | "right";

export interface ColumnProps {
  type: TypeProp; // index | selection | Expand (special type)
  prop: string; // Unit data (non-special type must be filled) Field name corresponds to the field name of the column content
  label: string; // Table title
  align: "left" | "center" | "right";
  width: number | string; // Sequence
  minWidth: number | string; // Minimum width
  isShow: boolean; // Whether it is displayed in the table
  sortable: boolean; // Whether it can be sorted (static sorting)
  fixed: FixedProp; // Fixed column
  tag: boolean; // Whether it is a label display
  image: boolean; // Whether it is a picture display
  search: boolean; // Whether it is a searchable item
  searchType: SearchType; // Search item type: text | select | multipleSelect | treeSelect | multipleTreeSelect | date | timerange | datetimerange
  searchProps: { [key: string]: any }; // Search item parameters, according to the element documentation, the tag comes with attributes > props attribute
  searchInitParam: string | number | boolean | any[]; // The initial value of the search item
  filterParam: (data: any) => any; // Filter parameters, the return value is the parameter object
  enum: EnumProps[]; // Dictionaries, formatted cells, and drop-down options for the search box
  enumFunction: () => Promise<any>; // Enumeration function, fills out enum with result
  enumTree: EnumProps[]; // Dictionaries, formatted cells, and drop-down options for the search box
  enumTreeFunction: () => Promise<any>; // Enumeration Tree function, fills out enumTree with result
  renderHeader: (params: any) => any; // Custom table header
  renderText: (data: any) => string; // custom (table only) Value renderer (will not be searchable)
}
