import { App } from "vue";
import copy from "./modules/copy";
import waterMarker from "./modules/waterMarker";
import draggable from "./modules/draggable";
import debounce from "./modules/debounce";
import throttle from "./modules/throttle";
import longpress from "./modules/longpress";

const directivesList: any = {
  // Custom directives
  copy,
  waterMarker,
  draggable,
  debounce,
  throttle,
  longpress
};

const directives = {
  install: function (app: App<Element>) {
    Object.keys(directivesList).forEach(key => {
      // Register all custom instructions
      app.directive(key, directivesList[key]);
    });
  }
};

export default directives;
