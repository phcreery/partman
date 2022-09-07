<template>
	<div class="home flx-center">
		Dashboard
		<!-- <img class="home-bg" src="@/assets/images/welcome.png" alt="welcome" /> -->
	</div>
</template>

<script setup lang="ts" name="home">
import { getNewToken, graphql } from "@/api/modules/octopart";
// getNewToken();
graphql({
	query:
		"query Search($mpn: String!) {\n    supSearchMpn(q: $mpn, limit: 2) {\n      results {\n        part {\n          mpn\n          shortDescription\n          manufacturer {\n            name\n          }\n          specs {\n            attribute {\n                shortname\n            }\n            value\n          }\n        }\n      }\n    }\n  }",
	variables: {
		mpn: "erjp06f7503v"
	}
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
