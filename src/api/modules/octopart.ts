import client from "@/api";
import { ElMessage } from "element-plus";

import { ResList, OctopartConfig } from "@/api/interface/index";

type OctopartTokenRes =
	| {
			access_token: string;
			expires_in: number;
			token_type: string;
			scope: string;
	  }
	| { error: string };

const getConfig = async () => {
	let res = (await client.records.getList("octopart_config")) as unknown as ResList<OctopartConfig.ResGetOctopartConfigRecord>;
	return res.items[0];
};

export const getNewToken = async () => {
	let config = await getConfig();
	let res = (await client.send("/api/octopart/connect/token", {
		method: "POST",
		body: `grant_type=client_credentials&client_id=${config.octopart_id}&client_secret=${config.octopart_secret}`,
		headers: { "Content-Type": "application/x-www-form-urlencoded" }
	})) as unknown as OctopartTokenRes;
	console.log("token info", res);
	if ("error" in res) {
		ElMessage.error(`Octopart Token Error: ${res.error}`);
		return "";
	}
	return res.access_token;
};

export const getToken = async () => {
	return await getNewToken();
};

export const graphql = async (body: object) => {
	let token = await getToken();
	let res = await client.send("/api/octopart/graphql", {
		method: "POST",
		body: body,
		headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
	});
	console.log("graphql res", res);
	return res;
};
