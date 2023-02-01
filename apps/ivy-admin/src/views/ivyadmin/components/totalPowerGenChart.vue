<template>
  <div class="w-full h-full" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, Ref, unref, watch } from 'vue'
import { createChart, IChart } from '@ivy/chart'
import type { FirstListValue } from '@/libs/model'
import { mock } from 'mockjs'

// 初始数据
const initTotalList: { records: FirstListValue[] } = {
  ...mock({
    'records|3000': [
      {
        update: '@time(mm:ss)',
        value: '@float(2800,6000,2,2)',
        value2: '@float(3000,6000,2,2)',
      },
    ],
  }),
}

const chartRef = ref<HTMLElement | null>(null)
let chart: IChart

const props = defineProps<{
  list: FirstListValue[]
}>()

let timer: NodeJS.Timer

onMounted(() => {
  chart = createChart(
    unref(chartRef as Ref<HTMLElement>),
    {
      color: ['#165DFF', 'rgba(106,161,255,0.3)'],
      grid: {
        top: '15%', //grid组件距上下左右的距离
        left: '5%',
        right: '5%',
        bottom: '5%',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        show: false,
      },
      yAxis: {
        type: 'value',
        show: false,
        max: 6000,
        min: 2800,
        interval: 1000,
      },
      series: [
        {
          name: 'Email',
          type: 'line',
          stack: 'one',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 3,
            cap: 'round',
          },
        },
        {
          name: 'Union Ads',
          type: 'line',
          smooth: true,
          symbol: 'none',
          stack: 'two',
          lineStyle: {
            type: [2, 6],
            // dashOffset: 3,
            width: 2,
            cap: 'round',
          },
        },
      ],
    },
    undefined,
    true
  )

  /**
   * 当使用假数据的时候
   */
  let start = 0
  let end = 10
  let source = initTotalList.records.slice(start, end)
  chart.setOption({
    dimensions: ['update', 'value', 'value2'],
    dataset: {
      source,
    } as any,
  })
  timer = setInterval(() => {
    start += 1
    end += 1
    source = initTotalList.records.slice(start, end)
    chart.setOption({
      dataset: {
        source,
      } as any,
    })
  }, 5000)
})

onUnmounted(() => {
  timer && clearInterval(timer)
})
/********************以上为假数据********************* */

// 当调用真实接口的时候
// watch(() => props.list, (source) => {
//   chart.setOption({
//     dimensions: ['update', 'value'],
//     dataset: {
//       source
//     } as any
//   })
// })
</script>
