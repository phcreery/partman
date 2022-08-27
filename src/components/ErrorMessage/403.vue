<template>
	<div class="not-container">
		<img src="@/assets/images/403.png" class="not-img" alt="403" />
		<div class="not-detail">
			<h2>403</h2>
			<h4>Sorry, you do not have permission to visit this page</h4>
			<el-button type="primary" @click="tabStore.goHome()">Return to home</el-button>
		</div>
	</div>
</template>

<script setup lang="ts" name="403">
import { TabsStore } from "@/store/modules/tabs";
const tabStore = TabsStore();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
