import * as json2csv from "json2csv/dist/json2csv.umd";

/**
 * @description Receive data running Blob, create links, download files
 * @param {Object} json Export parameter (default)
 * @param {Array<String>} fields Export parameter (default)
 * @return void
 * */
export const JSON2CSV = async (json: any = {}, fields: Array<String>) => {
	try {
		const opts = { fields };
		const parser = new json2csv.Parser(opts);
		const csv = parser.parse(json);
		// const csv = parse(json);
		console.log(csv);
		return csv;
	} catch (err) {
		console.error(err);
	}
};
