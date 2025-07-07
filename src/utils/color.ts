import { ElMessage } from "element-plus";

/**
 * @description Convert hex color to rgb color
 * @param {String} str Color value string
 * @returns {String} Returns the processed color value
 */
export function hexToRgb(str: string): number[] | undefined {
  const reg = /^#[0-9A-Fa-f]{6}$/;
  if (!reg.test(str)) ElMessage.warning("Invalid hex color input");
  return str
    .replace("#", "")
    .match(/../g)
    ?.map(item => parseInt(item, 16));
}

/**
 * @description Convert RGB color to Hex color
 * @param {Number} r Represents red
 * @param {Number} g Represents green
 * @param {Number} b Represents blue
 * @returns {String} Returns the processed color value
 */
export function rgbToHex(r: number, g: number, b: number) {
  return `#${[r.toString(16).padStart(2, "0"), g.toString(16).padStart(2, "0"), b.toString(16).padStart(2, "0")].join("")}`;
}
/**
 * @description Darken the color value
 * @param {String} color Color value string
 * @param {Number} level Degree of darkening, between 0 and 1
 * @returns {String} Returns the processed color value
 */
export function getDarkColor(color: string, level: number): string | undefined {
  const rgb = hexToRgb(color);
  if (!rgb) {
    ElMessage.warning("Invalid hex color input");
    return;
  }
  if (rgb) {
    return rgbToHex(
      Math.round(20.5 * level + rgb[0] * (1 - level)),
      Math.round(20.5 * level + rgb[1] * (1 - level)),
      Math.round(20.5 * level + rgb[2] * (1 - level))
    );
  }
}

/**
 * @description Lighten the color value
 * @param {String} color Color value string
 * @param {Number} level Degree of lightening, between 0 and 1
 * @returns {String} Returns the processed color value
 */
export function getLightColor(color: string, level: number) {
  const rgb = hexToRgb(color);
  if (rgb) {
    return rgbToHex(
      Math.round(255 * level + rgb[0] * (1 - level)),
      Math.round(255 * level + rgb[1] * (1 - level)),
      Math.round(255 * level + rgb[2] * (1 - level))
    );
  }
}
