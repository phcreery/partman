<template>
	<svg :style="iconStyle" aria-hidden="true">
		<use :xlink:href="symbolId" />
	</svg>
</template>

<script setup lang="ts" name="SvgIcon">
import { computed, CSSProperties } from "vue";

interface SvgProps {
	name: string; // Name of the Icon ==> Must Pass
	prefix?: string; // Icon prefixes ==> Not a must pass（Default is"icon"）
	iconStyle?: CSSProperties; // Icon style ==> Not a must pass
}
// Receive parent component parameters and set default values
const props = withDefaults(defineProps<SvgProps>(), {
	prefix: "icon",
	iconStyle: () => ({ width: "100px", height: "100px" })
});

const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>
