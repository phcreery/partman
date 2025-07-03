/**
 * v-debounce
 * 按钮防抖指令，可自行扩展至input
 * 接收参数：function类型，延迟时间
 */
import type { Directive, DirectiveBinding } from 'vue'
interface ElType extends HTMLElement {
  __handleClick__: () => any
}
const debounce: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    if (typeof binding.value !== 'function') {
      throw 'callback must be a function'
    }
    let timer: ReturnType<typeof setTimeout> | null = null
    el.__handleClick__ = function () {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(
        () => {
          binding.value()
        },
        binding.arg ? Number(binding.arg) : 500
      )
    }
    el.addEventListener('click', el.__handleClick__)
  },
  beforeUnmount(el: ElType) {
    el.removeEventListener('click', el.__handleClick__)
  },
}

export default debounce
