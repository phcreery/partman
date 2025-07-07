// This script is used to import the template into the project
import { copyFileSync, deleteFolderRecursive, copyFolderRecursiveSync2 } from "./utils.mjs";

const srcTemplateFilesToRemove = [
  "utils/serviceDict.ts" // contains unused male/female enum dict
];

const srcTemplateFoldersToRemove = [
  "src/components/WangEditor" // this is the old wang editor, use new one from template
];

// these file are the ones to keep untouched in the src directory
const srcMyFilesToKeep = [
  "hooks/useDataTransform.ts",
  "hooks/useDownload.ts",
  "utils/nestedObjectAssign.ts",
  "utils/filterNodeMethod.ts", // filterNodeMethod for filterable tree-select inputs
  "utils/util.ts", // implement findItemNested for tree-select enum
  "hooks/useTable.ts", // TODO: update pageParam() => page & perPage
  "hooks/useMerger.ts", // Object.assign(state.totalParam, { filter: nowSearchParam }, isPageable ? pageParam.value : {});
  "hooks/useSelection.ts", // addition of getRowKeys() for ProTable
  "components/Loading/fullScreen.ts", // fix race condition in multiple request from pocketbase sdk
  "layouts/components/Header/ToolBarRight.vue", // my custom toolbar with removed items
  "layouts/components/Header/components/About.vue", // my custom about
  "layouts/components/Header/components/PasswordDialog.vue", // my custom password dialog
  "layouts/components/Header/components/InfoDialog.vue" // my custom info dialog
];

// these folders are the ones to keep untouched in the src directory
const srcMyFoldersToKeep = [
  "views",
  "api",
  "assets",
  "components/ProTable",
  /* TODO: these ProTable changes should be merged with the template
  // Update button layout in top-right of pro-table
  // remove "item.isShow &&" from colSetting
  // change default pageSize: 25,
  // add { printData, tableColumns } to export
  // update updatedTotalParam() to include { filter: nowSearchParam }, isPageable ? pageParam.value : {}
  // update pageParam() to return { page: state.pageable.pageNum, perPage: state.pageable.pageSize }
  */
  "components/ProTree" // this is my tree component TODO: use new tree filter component found in the template
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
srcTemplateFoldersToRemove.forEach(folder => {
  deleteFolderRecursive(`src/${folder}`);
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
