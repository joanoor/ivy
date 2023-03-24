<template>
  <div
    w-full
    h-full
    class="chart-container"
    v-loading="loading"
    element-loading-text="地图数据载入中"
  >
    <div ref="chartRef" w-full h-full></div>
  </div>
</template>

<script setup lang="ts">
import { http } from '@utils/http'
import { createChart, getDefaultChartOpt, echarts, IChart } from '@ivy/chart'
import { mapCodes, generateMapCodes } from './mapCode'
import { useAppStore } from '@/store'

const props = withDefaults(
  defineProps<{
    chartData?: Recordable[]
    chartOption?: echarts.EChartsOption
    dimensions?: string[]
    canClick?: boolean
  }>(),
  {
    dimensions: () => [],
    chartData: () => [],
    chartOption: () => ({}),
    canClick: false,
  }
)

const chartRef = ref<HTMLElement | null>(null)
const useApp = useAppStore()
const loading = ref(false)
let chart = ref<IChart>()

const renderMap = (geoData: any) => {
  if (chartRef.value && geoData) {
    // 第一步：注册地图
    echarts.registerMap('安徽省', geoData)
    // 第二步，渲染地图
    chart.value = createChart(
      unref(chartRef as Ref<HTMLElement>),
      getDefaultChartOpt(props.chartOption, 'map')
    )
    console.log('renderMap')
    if (props.chartData.length > 0) {
      chart.value?.setOption({
        dataset: {
          source: props.chartData,
          dimensions: props.dimensions,
        },
      })
    }
    if (props.canClick) {
      chart.value.getChartInstance().on('click', param => {
        const tmpMapCode = (mapCodes.get(param.name) as number).toString()
        if (tmpMapCode.match(/00$/)) {
          useApp.pushChartMapDeepStack(tmpMapCode)
        }
      })
    }
  }
}

watchPostEffect(async () => {
  const r = useApp.chartMapDeepStack
  if (r.length > 0) {
    try {
      loading.value = true
      const res = await http.get(
        {
          url: `/static/${r[r.length - 1]}_full.json`,
        },
        {
          isTransformResponse: false,
        }
      )
      generateMapCodes(res)
      renderMap(res)
    } catch (err) {
      useApp.popChartMapDeepStack()
    } finally {
      loading.value = false
    }
  }
})

watch(
  () => props.chartData,
  source => {
    if (source.length > 0) {
      console.log('11111111111111')
      chart.value?.setOption({
        dataset: {
          source,
          dimensions: props.dimensions,
        },
      })
    }
  }
)
</script>
