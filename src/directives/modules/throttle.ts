/*
 Requirements: Prevent buttons from clicking on many times in a short period of time, using the throwing function to limit the specified time can only be clicked once.

  Idea:
    1. For the first click, call the method immediately and disable the button, wait for the delay to end the activation button again
    2. Bind the method that need to be triggered on the instruction
  
  Use: add V-Throttle and callback function to the DOM
  <button v-throttle="debounceClick">节流提交</button>
*/
import type { Directive, DirectiveBinding } from "vue";
interface ElType extends HTMLElement {
  __handleClick__: () => any;
  disabled: boolean;
}
const throttle: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    if (typeof binding.value !== "function") {
      throw "callback must be a function";
    }
    let timer: NodeJS.Timeout | null = null;
    el.__handleClick__ = function () {
      if (timer) {
        clearTimeout(timer);
      }
      if (!el.disabled) {
        el.disabled = true;
        binding.value();
        timer = setTimeout(() => {
          el.disabled = false;
        }, 1000);
      }
    };
    el.addEventListener("click", el.__handleClick__);
  },
  beforeUnmount(el: ElType) {
    el.removeEventListener("click", el.__handleClick__);
  }
};

export default throttle;
