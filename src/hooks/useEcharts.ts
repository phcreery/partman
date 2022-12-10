import { onUnmounted } from "vue";
import * as echarts from "echarts";

/**
 * @description Use eCharts (just to add graphics response)
 * @param {Element} myChart ECharts instance (must pass)
 * @param {Object} options Draw the parameters of ECharts (must pass)
 * @return void
 * */
export const useEcharts = (myChart: echarts.ECharts, options: echarts.EChartsCoreOption) => {
  if (options && typeof options === "object") {
    myChart.setOption(options);
  }
  const echartsResize = () => {
    myChart && myChart.resize();
  };

  window.addEventListener("resize", echartsResize, false);

  onUnmounted(() => {
    window.removeEventListener("resize", echartsResize);
  });
};
