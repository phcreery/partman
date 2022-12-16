import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { readdir, stat } from "fs/promises";
import { resolve } from "path";
// import { promisify } from "util";

import translate from "translate";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const readdir = promisify(fs.readdir);
// const stat = promisify(fs.stat);

const dir = path.join(__dirname, "../src");

const REGEX_CHINESE =
  /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u;
const hasJapanese = str => REGEX_CHINESE.test(str);

// Relevant ISO: ISO 639-1 & ISO 639-2. Google uses the ISO 639-1.
// Valid ISO 639-1 codes
// https://www.loc.gov/standards/iso639-2/php/code_list.php
translate.engine = "deepl"; // Or "google", "yandex", "libre", "deepl"
translate.key = process.env.DEEPL_KEY;
// const text = await translate(
//   `*
//  * v-longpress
//  * 长按指令，长按时触发事件
// `,
//   { from: "zh", to: "en" }
// );
// console.log(text);

// exit program
// process.exit(0);

// read all files recursively in directory
async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(
    subdirs.map(async subdir => {
      const res = resolve(dir, subdir);
      return (await stat(res)).isDirectory() ? getFiles(res) : res;
    })
  );
  return files.reduce((a, f) => a.concat(f), []);
}
const files = await getFiles(dir);

console.log(files);

// open each file and parse comments
for (const file of files) {
  // temporarily control the file to translate
  // let file = "C:\\Users\\phcre\\Documents\\JS\\partman\\client\\src\\api\\helper\\axiosCancel.ts";
  // return if file is not a .js, .ts, or .vue file
  if (!file.match(/\.(js|ts|vue)$/)) continue;
  // skip .min.js files
  if (file.match(/\.min\.js$/)) continue;

  let data = await fs.readFileSync(file, "utf8");

  // go through each character and combine sequences of characters that are chinese
  let chinese = "";
  let parsedComments = [];
  for (let i = 0; i < data.length; i++) {
    const char = data[i];
    if (hasJapanese(char)) {
      chinese += char;
    } else {
      if (chinese.length > 0) {
        parsedComments.push({ raw: chinese, index: i - chinese.length });
        chinese = "";
      }
    }
  }
  console.log(parsedComments);

  let replacers = [];

  await Promise.all(
    parsedComments.map(async comment => {
      const translated = await translate(comment.raw, { from: "zh", to: "en" });
      console.log(`###############\nFROM: \n"${comment.raw}" \nTO: \n"${translated}"`);
      replacers.push({ from: comment.raw, to: translated });
    })
  );
  await replacers.reduce(async (a, replacement) => {
    // Wait for the previous item to finish processing
    await a;
    // Process this item
    data = data.replace(replacement.from, replacement.to);
  }, Promise.resolve());

  // console.log(file, "\n", data);
  fs.writeFileSync(file, data, "utf8");
  // process.exit(0);
}
