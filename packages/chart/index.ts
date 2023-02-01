import type { EChartsOption } from 'echarts'
import type { CreateChartConfig } from './types'
import { IChart } from './src/Chart'
import { getDefaultChartOpt } from './src/BaseChart'

export function createChart(
  el: HTMLElement,
  opt: EChartsOption = {},
  config: CreateChartConfig = {}
) {
  let chart: IChart
  let chartOpt: EChartsOption
  const { chartType, theme, isRealRefresh, moreOpt } = config
  if (!chartType) {
    chart = new IChart(el, isRealRefresh, theme)
    chartOpt = opt
  } else {
    chart = new IChart(el, isRealRefresh, theme)
    chartOpt = getDefaultChartOpt(opt, chartType)
  }
  chart.setOption(chartOpt, moreOpt)
  return chart
}

export * from './types'
export * from './src/Chart'
export * from './node_modules/echarts/types/dist/echarts'

