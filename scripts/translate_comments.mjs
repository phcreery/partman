import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { readdir, stat } from "fs/promises";
import { resolve } from "path";
// import { promisify } from "util";

import translate from "translate";
import extractComments from "extract-comments";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const readdir = promisify(fs.readdir);
// const stat = promisify(fs.stat);

const dir = path.join(__dirname, "../src");

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
  const parsedComments = await extractComments(data);
  // console.log(parsedComments);
  // console.log(parsedComments.raw);

  let replacers = [];

  // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
  // https://gist.github.com/joeytwiddle/37d2085425c049629b80956d3c618971
  // Process all the parsedComments in parallel
  await Promise.all(
    parsedComments.map(async comment => {
      const translated = await translate(comment.raw, { from: "zh", to: "en" });
      console.log(`###############\nFROM: \n${comment.raw} \nTO: \n${translated}`);
      replacers.push({ from: comment.raw, to: translated });
    })
  );
  // Process each replacers in serial
  await replacers.reduce(async (a, replacement) => {
    // Wait for the previous item to finish processing
    await a;
    // Process this item
    data = data.replace(replacement.from, replacement.to);
  }, Promise.resolve());

  console.log(file, "\n", data);
  fs.writeFileSync(file, data, "utf8");
  process.exit(0);
}
