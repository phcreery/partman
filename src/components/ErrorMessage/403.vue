<template>
	<div class="not-container">
		<img src="@/assets/images/403.png" class="not-img" alt="403" />
		<div class="not-detail">
			<h2>403</h2>
			<h4>Sorry，You are not authorized to access this page~🙅‍♂️🙅‍♀️</h4>
			<el-button type="primary" @click="router.push(HOME_URL)">Back to top</el-button>
		</div>
	</div>
</template>

<script setup lang="ts" name="403">
import { useRouter } from "vue-router";
import { HOME_URL } from "@/config/config";
const router = useRouter();
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
