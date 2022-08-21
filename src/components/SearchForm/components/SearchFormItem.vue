<template>
	<!-- Text box -->
	<template v-if="item.searchType == undefined || item.searchType == 'text'">
		<el-input
			v-model="searchParam[item.prop!]"
			v-bind="item.searchProps"
			placeholder="Search term"
			:clearable="clearable(item)"
		></el-input>
	</template>
	<!-- Drop -down selection box -->
	<template v-if="item.searchType == 'select' || item.searchType == 'multipleSelect'">
		<el-select
			v-model="searchParam[item.prop!]"
			v-bind="item.searchProps"
			:multiple="item.searchType == 'multipleSelect'"
			placeholder="Select"
			:clearable="clearable(item)"
		>
			<el-option
				v-for="itemValue in item.enum"
				:key="itemValue[item.searchProps?.value] ?? itemValue.value"
				:label="itemValue[item.searchProps?.label] ?? itemValue.label"
				:value="itemValue[item.searchProps?.value] ?? itemValue.value"
				:disabled="itemValue.disabled"
			/>
		</el-select>
	</template>
	<!-- Pulling tree selection box -->
	<template v-if="item.searchType == 'treeSelect' || item.searchType == 'multipleTreeSelect'">
		<el-tree-select
			v-model="searchParam[item.prop!]"
			v-bind="item.searchProps"
			:multiple="item.searchType == 'multipleTreeSelect'"
			:data="item.enumTree"
			:clearable="clearable(item)"
		/>
	</template>
	<!-- Date selection -->
	<template v-if="item.searchType == 'date'">
		<el-date-picker
			v-model="searchParam[item.prop!]"
			v-bind="item.searchProps"
			value-format="YYYY-MM-DD"
			type="date"
			placeholder="Please select the date"
			:clearable="clearable(item)"
		/>
	</template>
	<!-- Time range selection -->
	<template v-if="item.searchType == 'timerange'">
		<el-time-picker
			v-model="searchParam[item.prop!]"
			v-bind="item.searchProps"
			is-range
			value-format="HH:mm:ss"
			range-separator="to"
			start-placeholder="Starting time"
			end-placeholder="End Time"
			:clearable="clearable(item)"
		/>
	</template>
	<!-- Date range selection -->
	<template v-if="item.searchType == 'daterange'">
		<el-date-picker
			v-model="searchParam[item.prop!]"
			v-bind="item.searchProps"
			type="daterange"
			value-format="YYYY-MM-DD"
			range-separator="to"
			start-placeholder="Starting time"
			end-placeholder="End Time"
			:clearable="clearable(item)"
		/>
	</template>
	<!-- Date time range selection -->
	<template v-if="item.searchType == 'datetimerange'">
		<el-date-picker
			v-model="searchParam[item.prop!]"
			v-bind="item.searchProps"
			type="datetimerange"
			value-format="YYYY-MM-DD HH:mm:ss"
			range-separator="to"
			start-placeholder="Starting time"
			end-placeholder="End Time"
			:clearable="clearable(item)"
		/>
	</template>
</template>

<script setup lang="ts" name="searchFormItem">
import { ColumnProps } from "@/components/ProTable/interface/index";

interface SearchFormItem {
	item: Partial<ColumnProps>; // Specific configuration of each search item
	searchParam: any; // Search parameter
}

// Whether there is a clear button (when the search item has the default value, the removal button does not display)
const clearable = (item: Partial<ColumnProps>) => {
	return item.searchInitParam == null || item.searchInitParam == undefined;
};

defineProps<SearchFormItem>();
</script>
