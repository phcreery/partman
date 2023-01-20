import { ElNotification } from "element-plus";

/**
 * @description 全局代码Error捕捉
 * */
const errorHandler = (error: any) => {
  // Filtering HTTP Request Error
  if (error.status || error.status == 0) return false;
  let errorMap: { [key: string]: string } = {
    InternalError: "JavascriptInternal engine errors",
    ReferenceError: "No match found",
    TypeError: "Wrong type or object is used",
    RangeError: "When using built-in objects，Parameters out of range",
    SyntaxError: "Grammatical errors",
    EvalError: "Wrong use ofEval",
    URIError: "URI错误"
  };
  let errorName = errorMap[error.name] || "Unknown error";
  ElNotification({
    title: errorName,
    message: error,
    type: "error",
    duration: 3000
  });
  console.error(error);
};

export default errorHandler;
