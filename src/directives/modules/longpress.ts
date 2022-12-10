/**
 * v-longpress
 * Long press the instruction, long press to trigger the event on time
 */
import type { Directive, DirectiveBinding } from "vue";

const directive: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (typeof binding.value !== "function") {
      throw "callback must be a function";
    }
    // Definition variable
    let pressTimer: any = null;
    // Create a timer (execute function after 2 seconds)
    const start = (e: any) => {
      if (e.button) {
        if (e.type === "click" && e.button !== 0) {
          return;
        }
      }
      if (pressTimer === null) {
        pressTimer = setTimeout(() => {
          handler(e);
        }, 1000);
      }
    };
    // Cancel the timer
    const cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };
    // Run function
    const handler = (e: MouseEvent | TouchEvent) => {
      binding.value(e);
    };
    // Add event monitor
    el.addEventListener("mousedown", start);
    el.addEventListener("touchstart", start);
    // Cancel the timer
    el.addEventListener("click", cancel);
    el.addEventListener("mouseout", cancel);
    el.addEventListener("touchend", cancel);
    el.addEventListener("touchcancel", cancel);
  }
};

export default directive;
