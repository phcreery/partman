<template>
	<div class="fullscreen">
		<el-tooltip effect="dark" :content="isFullscreen ? 'Exit Full Screen' : 'Full Screen'" placement="bottom">
			<i :class="['iconfont', isFullscreen ? 'icon-suoxiao' : 'icon-fangda']" class="icon-style" @click="toggle"></i>
		</el-tooltip>
	</div>
</template>

<script setup lang="ts">
import { useFullscreen } from "@vueuse/core";
const { toggle, isFullscreen } = useFullscreen();
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
