import * as json2csv from "json2csv";
// import { read, writeFileXLSX } from "xlsx";
import XLSX from "xlsx";

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

// function fileReader(oEvent: any) {
//   let oFile = oEvent.target.files[0];
//   let sFilename = oFile.name;

//   let reader = new FileReader();
//   let result = {};

//   reader.onload = function (e: any) {
//       let data = e.target.result;
//       data = new Uint8Array(data);
//       let workbook = XLSX.read(data, {type: 'array'});
//       console.log(workbook);
//       let result = {};
//       workbook.SheetNames.forEach(function (sheetName) {
//         let roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1});
//           if (roa.length) result[sheetName] = roa;
//       });
//       // see the result, caution: it works after reader event is done.
//       console.log(result);
//   };
//   reader.readAsArrayBuffer(oFile);
// }

function getBuffer(fileData: File): Promise<ArrayBuffer> {
  return new Promise(resolve => {
    let reader = new FileReader();
    reader.onload = function (e) {
      let arrayBuffer = e.target?.result;
      // let arrayBuffer = reader.result
      resolve(arrayBuffer as ArrayBuffer);
    };
    reader.readAsArrayBuffer(fileData);
  });
}

export const CSV2JSON = async (file: File) => {
  let arrayBuffer = await getBuffer(file);
  let workbook = XLSX.read(arrayBuffer);

  let result: any = {};
  workbook.SheetNames.forEach(function (sheetName) {
    let roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    if (roa.length) Object.assign(result, { [sheetName]: roa });
  });
  return result;
};
