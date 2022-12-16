/*
	Demand：Implement a drag and drop command，可In父元素区域任意拖拽元素。

	Ideas：
		1、Set the element to be dragged toabsolute，Its parent element isrelative。
		2、Mouse down(onmousedown)When recording the target element's current left and top Value。
		3、Mouse movement(onmousemove)时计算每次移动的横向距离and纵向距离的变化Value，and change the element's left 和 top 值
		4、Mouse Release(onmouseup)When completing a drag and drop

	Use：在 Dom Add on v-draggable that's all
	<div class="dialog-model" v-draggable></div>
*/
import type { Directive } from "vue";
interface ElType extends HTMLElement {
	parentNode: any;
}
const draggable: Directive = {
	mounted: function (el: ElType) {
		el.style.cursor = "move";
		el.style.position = "absolute";
		el.onmousedown = function (e) {
			let disX = e.pageX - el.offsetLeft;
			let disY = e.pageY - el.offsetTop;
			document.onmousemove = function (e) {
				let x = e.pageX - disX;
				let y = e.pageY - disY;
				let maxX = el.parentNode.offsetWidth - el.offsetWidth;
				let maxY = el.parentNode.offsetHeight - el.offsetHeight;
				if (x < 0) {
					x = 0;
				} else if (x > maxX) {
					x = maxX;
				}

				if (y < 0) {
					y = 0;
				} else if (y > maxY) {
					y = maxY;
				}
				el.style.left = x + "px";
				el.style.top = y + "px";
			};
			document.onmouseup = function () {
				document.onmousemove = document.onmouseup = null;
			};
		};
	}
};
export default draggable;
