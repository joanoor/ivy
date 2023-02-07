import MyEcharts, { createChart } from '@ivy/chart'
import { ref, Ref, unref } from 'vue'

export default function (
  chartOption: MyEcharts.EChartsOption,
  option: {
    lazy: false
  }
) {
  const chartRef = ref<HTMLElement | null>(null)

  const chart = createChart(unref(chartRef as Ref<HTMLElement>), chartOption)

  return {
    chart,
    chartRef,
  }
}
