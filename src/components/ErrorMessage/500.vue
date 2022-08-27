<template>
	<div class="not-container">
		<img src="@/assets/images/500.png" class="not-img" alt="500" />
		<div class="not-detail">
			<h2>500</h2>
			<h4>Sorry, the server encountered an unexpected error</h4>
			<el-button type="primary" @click="tabStore.goHome()">Return to home</el-button>
		</div>
	</div>
</template>

<script setup lang="ts" name="500">
import { TabsStore } from "@/store/modules/tabs";
const tabStore = TabsStore();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
