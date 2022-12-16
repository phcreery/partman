/*
  Demand：Add a background watermark to the entire page。

  Ideas：
    1、Use canvas Feature Generation base64 Formatted image files，设置其Fonts大小，Color, etc.。
    2、Set it as the background image，thus achieving the page or component watermark effect
  
  Use：Set watermark copy，Color，Font size is fine
  <div v-waterMarker="{text:'All rights reserved',textColor:'rgba(180, 180, 180, 0.4)'}"></div>
*/

import type { Directive, DirectiveBinding } from "vue";
const addWaterMarker: Directive = (str: string, parentNode: any, font: any, textColor: string) => {
	// Watermark text，Parent element，字体，Text color
	let can: HTMLCanvasElement = document.createElement("canvas");
	parentNode.appendChild(can);
	can.width = 205;
	can.height = 140;
	can.style.display = "none";
	let cans = can.getContext("2d") as CanvasRenderingContext2D;
	cans.rotate((-20 * Math.PI) / 180);
	cans.font = font || "16px Microsoft JhengHei";
	cans.fillStyle = textColor || "rgba(180, 180, 180, 0.3)";
	cans.textAlign = "left";
	cans.textBaseline = "Middle" as CanvasTextBaseline;
	cans.fillText(str, can.width / 10, can.height / 2);
	parentNode.style.backgroundImage = "url(" + can.toDataURL("image/png") + ")";
};

const waterMarker = {
	mounted(el: DirectiveBinding, binding: DirectiveBinding) {
		addWaterMarker(binding.value.text, el, binding.value.font, binding.value.textColor);
	}
};

export default waterMarker;
