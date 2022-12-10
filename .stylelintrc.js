// @see: https://stylelint.io

module.exports = {
  /* Inherit some existing rules */
  extends: [
    "stylelint-config-standard", // Configure the stylelint expansion plug -in
    "stylelint-config-html/vue", // Configure the Template style formatting in Vue
    "stylelint-config-standard-scss", //Configure stylelint SCSS plug -in
    "stylelint-config-recommended-vue/scss", // Configure the SCSS style formatting in Vue
    "stylelint-config-recess-order", // Configure the stylelint CSS attribute writing order plug -in,
    "stylelint-config-prettier" // Configure styleLint and Prettier compatibility
  ],
  overrides: [
    // Scan .vue/html file in the <style> label
    {
      files: ["**/*.{vue,html}"],
      customSyntax: "postcss-html"
    }
  ],
  /**
   * null  => Turn off the rule
   */
  rules: {
    "no-descending-specificity": null, // It is forbidden to appear a lower priority selection device that is covered with a high priority selectioner
    "function-url-quotes": "always", // Require or prohibit URL's quotes "Always (must be added with quotes)" | NEVER (no quoted) "
    "string-quotes": "double", // Specify a string to use a single quotation number or dual quotation number
    "unit-case": null, // Specification of the designated unit "LOWER (Full of Case)" | "Upper (fully written)" ""
    "color-hex-case": "lower", // Specify the case of the hexadecimal color "LOWER (full lowercase)" | upper (full -write) ""
    "color-hex-length": "long", // Specify the abbreviation or expansion of the hexadecimal color "SHORT (Hexadecimal abbreviation)" | "Long (hexadecimal expansion)"
    "rule-empty-line-before": "never", // Require or prohibit the empty line "Always before the rules (must always have an empty line before the rules)" | "NEVER (must not have an empty line before the rules)" | Always-Multi-Line (must always be available before the multi-line rules must always be available before"One empty line)" NEVER-Multi-Line (must not have an empty line before the multi-line rules.) "" "" "" "" "
    "font-family-no-missing-generic-family-keyword": null, // Forbidden to lack general -purpose font group keywords in the list of font names
    "block-opening-brace-space-before": "always", // There must be a space or a blank symbol "Alway (must always have a space before the brackets)" | "NEVER before the bonus)" | AlwayS-SINGLE-LINE (must always have a space before the left brackets in one-line block) "" NEVER-SINGLE-LINE (must not have a space before the left blockbuts in one line) "" Always-Multi-Line (in theIn the multi-line block, there must always be a space before the left brackets) "" NEVER-Multi-Line (the left bonus in the multi-row block must not have a space before)
    "property-no-unknown": null, // No unknown attributes (TRUE is not allowed)
    "no-empty-source": null, // No empty source code
    "declaration-block-trailing-semicolon": null, // Requirement or not allowed to use the tail score number string in the statement: "Always (must always have a score number)" | "
    "selector-class-pattern": null, // Format of forced selection device category name
    "scss/at-import-partial-extension": null, // Solution cannot introduce SCSS files
    "value-no-vendor-prefix": null, // Turn off Vendor-Prefix (in order to solve the multi-line -webkit-box)
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global", "v-deep", "deep"]
      }
    ]
  }
};
