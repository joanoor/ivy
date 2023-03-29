<template>
  <div
    w-full
    h-full
    class="chart-container"
    v-loading="loading"
    element-loading-text="图表数据载入中"
  >
    <el-empty
      v-if="chartData?.length === 0"
      w-full
      h-full
      :image-size="100"
      description="暂无图表"
    />
    <div ref="chartRef" w-full h-full v-else></div>
  </div>
</template>

<script setup lang="ts">
import {
  createChart,
  getDefaultChartOpt,
  echarts,
  ChartType,
  IChart,
} from '@ivy/chart'
interface ChartProps<T = any> {
  chartData?: T[]
  dimensions?: string[]
  chartType: ChartType
  chartOption?: echarts.EChartsOption
  loading: boolean
  callback?: (chart: IChart) => void
}

const props = withDefaults(defineProps<ChartProps>(), {
  chartData: () => [],
  dimensions: () => [],
  chartOption: () => ({}),
})

const chartRef = ref<HTMLElement | null>(null)

let chart: IChart | null = null

const renderChart = (source: any) => {
  chart = createChart(
    unref(chartRef as Ref<HTMLElement>),
    getDefaultChartOpt(
      {
        ...props.chartOption,
        dataset: {
          dimensions: props.dimensions,
          source,
        },
      },
      props.chartType
    )
  )

  props.callback && chart && props.callback(chart)
}

watch(() => props.chartData, renderChart, {
  immediate: true,
  flush: 'post',
  deep: true,
})
</script>

<style scoped></style>
