import { ElMessage } from "element-plus";

/**
 * hexColor转rgbColor
 * @param str Color value string
 * @returns Returns the processed color value
 */
export function hexToRgb(str: any) {
	let hexs: any = "";
	let reg = /^\#?[0-9A-Fa-f]{6}$/;
	if (!reg.test(str)) return ElMessage.warning("Incorrectly enteredhex");
	str = str.replace("#", "");
	hexs = str.match(/../g);
	for (let i = 0; i < 3; i++) hexs[i] = parseInt(hexs[i], 16);
	return hexs;
}

/**
 * rgbColor ConversionHex颜色
 * @param r Represents red
 * @param g Represents green
 * @param b Represents blue
 * @returns Returns the processed color value
 */
export function rgbToHex(r: any, g: any, b: any) {
	let reg = /^\d{1,3}$/;
	if (!reg.test(r) || !reg.test(g) || !reg.test(b)) return ElMessage.warning("Incorrectly enteredrgbColor Value");
	let hexs = [r.toString(16), g.toString(16), b.toString(16)];
	for (let i = 0; i < 3; i++) if (hexs[i].length == 1) hexs[i] = `0${hexs[i]}`;
	return `#${hexs.join("")}`;
}

/**
 * Deepen the color value
 * @param color Color value string
 * @param level Degree of deepening，Limit0-1Between
 * @returns Returns the processed color value
 */
export function getDarkColor(color: string, level: number) {
	let reg = /^\#?[0-9A-Fa-f]{6}$/;
	if (!reg.test(color)) return ElMessage.warning("Incorrectly enteredhexColor Value");
	let rgb = hexToRgb(color);
	for (let i = 0; i < 3; i++) rgb[i] = Math.round(20.5 * level + rgb[i] * (1 - level));
	return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

/**
 * Lightened color value
 * @param color Color value string
 * @param level Degree of deepening，Limit0-1Between
 * @returns Returns the processed color value
 */
export function getLightColor(color: string, level: number) {
	let reg = /^\#?[0-9A-Fa-f]{6}$/;
	if (!reg.test(color)) return ElMessage.warning("Incorrectly enteredhexColor Value");
	let rgb = hexToRgb(color);
	for (let i = 0; i < 3; i++) rgb[i] = Math.round(255 * level + rgb[i] * (1 - level));
	return rgbToHex(rgb[0], rgb[1], rgb[2]);
}
