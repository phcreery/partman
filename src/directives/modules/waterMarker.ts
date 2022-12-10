/*
  Requirement: Add background watermark to the entire page.

  Idea:
    1、Use Canvas features to generate picture files in Base64 format, set its font size, color, etc.
    2、Set it as the background picture to achieve the watermark effect of the page or component
  
  Use: Set watermark copywriting, color, font size,
  <div v-waterMarker="{text:'all rights reserved',textColor:'rgba(180, 180, 180, 0.4)'}"></div>
*/

import type { Directive, DirectiveBinding } from "vue";
const addWaterMarker: Directive = (str: string, parentNode: any, font: any, textColor: string) => {
  // 水印文字，父元素，字体，文字颜色
  let can: HTMLCanvasElement = document.createElement("canvas");
  parentNode.appendChild(can);
  can.width = 200;
  can.height = 150;
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
