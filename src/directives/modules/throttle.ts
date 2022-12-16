/*
  Demand：Prevent buttons from being clicked multiple times in a short period of time，Use节流函数限制规定时间内只能点击一次。

  Ideas：
    1、First click，Immediately call the method and disable the button，Wait for the delay to end and activate the button again
    2、Bind the method to be triggered to the instruction
  
  使用：For Dom Plus v-throttle and callback functions can be
  <button v-throttle="debounceClick">Throttle Submission</button>
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
