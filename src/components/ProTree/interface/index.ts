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
	prop: string; // Unit data (non -special type must be filled)
	label: string; // Cell title (non -special type must be filled)
	align: "left" | "center" | "right";
	width: number | string; // Sequence
	minWidth: number | string; // Minimum width
	isShow: boolean; // Whether it is displayed in the table
	sortable: boolean; // Whether it can be sorted (static sorting)
	fixed: FixedProp; // Fixed column
	tag: boolean; // Whether it is a label display
	image: boolean; // Whether it is a picture display
	search: boolean; // Whether it is a search item
	searchType: SearchType; // Search item type
	searchProps: { [key: string]: any }; // Search item parameters, according to Element documents, label self -label attributes> props attributes
	searchInitParam: string | number | boolean | any[]; // The initial value of the search item
	enum: EnumProps[]; // Extremely enumerated type (dictionary of rendering value)
	enumFunction: () => Promise<any>; // Extremely enumerated type (dictionary of rendering value)
	enumTree: EnumProps[]; // Extremely enumerated type (dictionary of rendering value in tree format)
	enumTreeFunction: () => Promise<any>; // Extremely enumerated type (dictionary of rendering value in tree format)
	renderHeader: (params: any) => any; // Custom header
	renderText: (data: any) => string; // custom value renderer
}
