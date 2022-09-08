<template>
	<div class="home flx-center">
		Dashboard
		<!-- <img class="home-bg" src="@/assets/images/welcome.png" alt="welcome" /> -->
	</div>
</template>

<script setup lang="ts" name="home">
import { getNewToken, graphql, getPartListByMPN } from "@/api/modules/octopart";

getPartListByMPN("erjp06f7503v");
// getNewToken();
// graphql({
// 	query: `query Search($mpn: String!) {
// 				    supSearchMpn(q: $mpn, limit: 2) {
// 			  	    results {
// 					      part {
// 					        mpn
// 						      shortDescription
// 									descriptions {
// 										text
// 										creditString
// 										creditUrl
// 									}
// 						      manufacturer {
// 						        name
// 						      }
// 									category {
// 										name
// 										path
// 									}
// 									specs {
// 										attribute {
// 											name
// 											shortname
// 										}
// 										value
// 										displayValue
// 									}
// 								}
// 							}
// 						}
// 				  }`,
// 	variables: {
// 		mpn: "erjp06f7503v"
// 	}
// });
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
