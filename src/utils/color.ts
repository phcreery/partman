import { ElMessage } from 'element-plus'

/**
 * @description hex颜色转rgb颜色
 * @param {String} str 颜色值字符串
 * @returns {String} 返回处理后的颜色值
 */
export function hexToRgb(str: string) {
  const reg = /^#[0-9A-Fa-f]{6}$/
  if (!reg.test(str)) return ElMessage.warning('输入错误的hex')
  return str
    .replace('#', '')
    .match(/../g)
    ?.map(item => parseInt(item, 16))
}

/**
 * @description rgb颜色转Hex颜色
 * @param {Number} r 代表红色
 * @param {Number} g 代表绿色
 * @param {Number} b 代表蓝色
 * @returns {String} 返回处理后的颜色值
 */
export function rgbToHex(r: number, g: number, b: number) {
  return `#${[r.toString(16).padStart(2, '0'), g.toString(16).padStart(2, '0'), b.toString(16).padStart(2, '0')].join('')}`
}

/**
 * @description 加深颜色值
 * @param {String} color 颜色值字符串
 * @param {Number} level 加深的程度，限0-1之间
 * @returns {String} 返回处理后的颜色值
 */
export function getDarkColor(color: string, level: number) {
  const rgb = hexToRgb(color)
  if (rgb) {
    return rgbToHex(
      Math.round(20.5 * level + rgb[0] * (1 - level)),
      Math.round(20.5 * level + rgb[1] * (1 - level)),
      Math.round(20.5 * level + rgb[2] * (1 - level))
    )
  }
}

/**
 * @description 变浅颜色值
 * @param {String} color 颜色值字符串
 * @param {Number} level 加深的程度，限0-1之间
 * @returns {String} 返回处理后的颜色值
 */
export function getLightColor(color: string, level: number) {
  const rgb = hexToRgb(color)
  if (rgb) {
    return rgbToHex(
      Math.round(255 * level + rgb[0] * (1 - level)),
      Math.round(255 * level + rgb[1] * (1 - level)),
      Math.round(255 * level + rgb[2] * (1 - level))
    )
  }
}
