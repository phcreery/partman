/**
 * v-longpress
 * Long press command，Trigger event on long time
 */
import type { Directive, DirectiveBinding } from "vue";

const directive: Directive = {
	mounted(el: HTMLElement, binding: DirectiveBinding) {
		if (typeof binding.value !== "function") {
			throw "callback must be a function";
		}
		// Define Variables
		let pressTimer: any = null;
		// Create Timer（ 2Function execution after seconds ）
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
		// Cancel Timer
		const cancel = () => {
			if (pressTimer !== null) {
				clearTimeout(pressTimer);
				pressTimer = null;
			}
		};
		// Run the function
		const handler = (e: MouseEvent | TouchEvent) => {
			binding.value(e);
		};
		// Adding event listeners
		el.addEventListener("mousedown", start);
		el.addEventListener("touchstart", start);
		// Cancel Timer
		el.addEventListener("click", cancel);
		el.addEventListener("mouseout", cancel);
		el.addEventListener("touchend", cancel);
		el.addEventListener("touchcancel", cancel);
	}
};

export default directive;
