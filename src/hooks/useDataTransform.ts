import * as json2csv from "json2csv";

/**
 * @description Receive data running Blob, create links, download files
 * @param {Object} json Export parameter (default)
 * @param {Array<string>} fields Export parameter (default)
 * @return void
 * */
export const JSON2CSV = async (json: any = {}, fields: Array<string>) => {
  try {
    const opts: json2csv.Options<unknown> = { fields };
    const parser = new json2csv.Parser(opts);
    const csv = parser.parse(json);
    // const csv = parse(json);
    console.log(csv);
    return csv;
  } catch (err) {
    console.error(err);
  }
};
