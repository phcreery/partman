// This script is used to import the template into the project
import { copyFolderRecursiveSync, copyFileSync, deleteFolderRecursive, copyFolderRecursiveSync2 } from "./utils.mjs";

const srcTemplateFilesToRemove = [
  "utils/serviceDict.ts" // contains unused male/female enum dict
];

// const srcTemplateFoldersToRemove = [];

// these file are the ones to keep untouched in the src directory
const srcMyFilesToKeep = ["hooks/useDataTransform.ts", "hooks/useDownload.ts", "utils/nestedObjectAssign.ts"];

// these folders are the ones to keep untouched in the src directory
const srcMyFoldersToKeep = [
  "views",
  "api",
  "assets",
  "components/ProTable", // TODO: these changes should be merged with the template
  // Update button layout in top-right of pro-table
  // remove "item.isShow &&" from colSetting
  // change default pageSize: 25,
  "hooks/useTable.ts", // TODO: update pageParam() => page & perPage
  // Object.assign(state.totalParam, { filter: nowSearchParam }, isPageable ? pageParam.value : {});
  "utils/util.ts",
  // implement findItemNested for tree-select enum
  "components/ProTree", // TODO: use new tree filter component found in the template
  "layouts/components/Header/ToolBarRight.vue" // my custom toolbar with removed items
];

// backup src directory to src_backup
deleteFolderRecursive("src_backup");
copyFolderRecursiveSync2("src", "src_backup");

// delete all files in src directory
deleteFolderRecursive("src");

// copy all files from template/src to src
copyFolderRecursiveSync2("template/src", "src");

// delete files to remove from src
srcTemplateFilesToRemove.forEach(file => {
  deleteFolderRecursive(`src/${file}`);
});

// copy files to keep from src_backup to src
srcMyFilesToKeep.forEach(file => {
  copyFileSync(`src_backup/${file}`, `src/${file}`);
});

// copy folders to keep from src_backup to src
srcMyFoldersToKeep.forEach(folder => {
  deleteFolderRecursive(`src/${folder}`);
  copyFolderRecursiveSync2(`src_backup/${folder}`, `src/${folder}`);
});
