// @see: https://www.prettier.cn

module.exports = {
  // More than the maximum value change
  printWidth: 130,
  // Indentation byte number
  tabWidth: 2,
  // Use the surface system instead of the space shrinkage
  useTabs: false,
  // There is no segmentation at the end (TRUE, False No)
  semi: true,
  // Use a single quotation number (TRUE single and double quotes, false dual quotes)
  singleQuote: false,
  // Change the time selection of the reference object attribute "<As-Needed | Consistent | Preserve>" "" "
  quoteProps: "as-needed",
  // Add an empty lattice between the objects and array brackets and text "{foo: bar}"
  bracketSpacing: true,
  // Time to print the commas as much as possible.(For example, there will never be a comma ending in a single array.) The optional value "<none | ES5 | All>", default None
  trailingComma: "none",
  // Use a single quotation number instead of dual quotes in JSX
  jsxSingleQuote: false,
  //  (x) => {} The parameter of the arrow function must have small brackets when there is only one.avoid: omitted brackets, alway: not omitted brackets
  arrowParens: "avoid",
  // If there is already a DOCLOCK on the top of the file, this option will create a new line of comment and hit @Format mark.
  insertPragma: false,
  // Specify the parser to be used, no need to write the beginning of the file @Prettier
  requirePragma: false,
  // Defaults.Because of the use of some sensitive renders (such as GitHub Comment), it is based on the Markdown text style
  proseWrap: "preserve",
  // Is it a sensitive "CSS" -CSS -compliance with the default value of the CSS display attribute in the HTML hollow?
  htmlWhitespaceSensitivity: "css",
  // The ending of the line is the optional value of the use of LF"<auto|lf|crlf|cr>"
  endOfLine: "auto",
  // These two options can be used to formatting the code that starts and ends with the offset (including and excluding).
  rangeStart: 0,
  rangeEnd: Infinity,
  // Vue file script and style label shrinkage
  vueIndentScriptAndStyle: false
};
