import { onActivated, onDeactivated, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

/**
 * @description UseEcharts(Just to add chart responsiveness)
 * @param {Element} myChart EchartsExample(Must Pass)
 * @param {Object} options DrawingEchartsThe parameters of(Must Pass)
 * @return void
 * */
export const useEcharts = (myChart: echarts.ECharts, options: echarts.EChartsCoreOption) => {
  if (options && typeof options === "object") {
    myChart.setOption(options);
  }
  const echartsResize = () => {
    myChart && myChart.resize();
  };

  window.addEventListener("resize", echartsResize);

  // onActivated(() => {
  //   window.addEventListener("resize", echartsResize);
  // });

  // onDeactivated(() => {
  //   window.removeEventListener("resize", echartsResize);
  // });

  // onBeforeUnmount(() => {
  //   window.removeEventListener("resize", echartsResize);
  // });
};
