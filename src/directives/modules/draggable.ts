/*
	Demand: Implement a drag instruction that can drag the element in the parent element area.

	Idea:
		1、Set the element that needs to be dragged is absolute, and its parent element is related.
		2、When the mouse is pressed (onmousedown), the current lead and top value of the target element is recorded.
		3、Calculate the change value of each movement and longitudinal distance when the mouse moves (onmousemove), and changes the elements of the LEFT and TOP values of the element
		4、After the mouse is loose (onmouseup), drag it once

	Use: add V-DRAGGable to the DOM
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
