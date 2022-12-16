// * Echarts On-demand introduction
import * as echarts from "echarts/core";
import {
	BarChart,
	// 系列Type的定义后缀都为 SeriesOption
	BarSeriesOption,
	LineChart,
	LineSeriesOption
} from "echarts/charts";
import { LegendComponent } from "echarts/components";
import {
	TitleComponent,
	// The component types are defined with the suffix ComponentOption
	TitleComponentOption,
	TooltipComponent,
	TooltipComponentOption,
	GridComponent,
	GridComponentOption,
	// Data set components
	DatasetComponent,
	DatasetComponentOption,
	// Built-in data converter assembly (filter, sort)
	TransformComponent
} from "echarts/components";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

// By ComposeOption to assemble a chart with only the required components and Option 类型
export type ECOption = echarts.ComposeOption<
	| BarSeriesOption
	| LineSeriesOption
	| TitleComponentOption
	| TooltipComponentOption
	| GridComponentOption
	| DatasetComponentOption
>;

// Register required components
echarts.use([
	LegendComponent,
	TitleComponent,
	TooltipComponent,
	GridComponent,
	DatasetComponent,
	TransformComponent,
	BarChart,
	LineChart,
	LabelLayout,
	UniversalTransition,
	CanvasRenderer
]);

export default echarts;
