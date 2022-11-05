import { ElNotification } from "element-plus";

/**
 * @description Receive data running Blob, create links, download files
 * @param {Function} api Export form API method (must pass)
 * @param {String} tempName Export file name (must pass)
 * @param {Object} params Export parameter (default)
 * @param {Boolean} isNotify Whether there is an export message (default)
 * @param {String} fileType Export file format (default .xlsx)
 * @return void
 * */
export const useDownload = async (
  api: (param: any) => Promise<any>,
  tempName: string,
  params: any = {},
  isNotify: boolean = true,
  fileType: string = ".xlsx"
) => {
  if (isNotify) {
    ElNotification({
      title: "Info",
      message: "If the dataset is large, that download may take some time.",
      type: "info",
      duration: 2000
    });
  }
  try {
    const res = await api(params);
    // Type in this place is okay, because the ZIP file doesn’t know what Type is
    // const blob = new Blob([res], {
    // 	type: "application/vnd.ms-excel;charset=UTF-8"
    // });
    const blob = new Blob([res]);
    // Compatible Edge does not support the CreateObjecturn method
    if ("msSaveOrOpenBlob" in navigator) return window.navigator.msSaveOrOpenBlob(blob, tempName + fileType);
    const blobUrl = window.URL.createObjectURL(blob);
    const exportFile = document.createElement("a");
    exportFile.style.display = "none";
    let currentDateTime = new Date().toISOString().split("T")[0];
    exportFile.download = `${currentDateTime}_${tempName}${fileType}`;
    exportFile.href = blobUrl;
    document.body.appendChild(exportFile);
    exportFile.click();
    // Remove the effect of download on the URL
    document.body.removeChild(exportFile);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.log(error);
  }
};
