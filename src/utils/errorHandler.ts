import { ElNotification } from "element-plus";

/**
 * @description Global code error handler
 * */
const errorHandler = (error: any) => {
  // Filter HTTP request errors
  if (error.status || error.status == 0) return false;
  const errorMap: { [key: string]: string } = {
    InternalError: "Internal JavaScript engine error",
    ReferenceError: "Object not found",
    TypeError: "Incorrect type or object used",
    RangeError: "Parameter out of range when using built-in object",
    SyntaxError: "Syntax error",
    EvalError: "Incorrect use of Eval",
    URIError: "URI error"
  };
  const errorName = errorMap[error.name] || "Unknown error";
  console.error("Global error handler:", error);
  ElNotification({
    title: errorName,
    message: error,
    type: "error",
    duration: 3000
  });
};

export default errorHandler;
