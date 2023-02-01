<template>
  <div class="w-full h-full" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, Ref, unref } from 'vue'
import { createChart, IChart } from '@ivy/chart'
import type { FirstListValue } from '@/libs/model'
import { mock } from 'mockjs'

// 初始数据

const initTotalList = (): { records: FirstListValue[] } => {
  return {
    ...mock({
      records: [
        {
          update: 'Mon',
          value: '@float(90,300,2,2)',
          value2: '@float(80,250,2,2)',
        },
        {
          update: 'Tue',
          value: '@float(90,300,2,2)',
          value2: '@float(80,250,2,2)',
        },
        {
          update: 'Wed',
          value: '@float(90,300,2,2)',
          value2: '@float(80,250,2,2)',
        },
        {
          update: 'Thu',
          value: '@float(90,300,2,2)',
          value2: '@float(80,250,2,2)',
        },
        {
          update: 'Fri',
          value: '@float(90,300,2,2)',
          value2: '@float(80,250,2,2)',
        },
        {
          update: 'Sat',
          value: '@float(90,300,2,2)',
          value2: '@float(80,250,2,2)',
        },
        {
          update: 'Sun',
          value: '@float(90,300,2,2)',
          value2: '@float(80,250,2,2)',
        },
      ],
    }),
  }
}

const chartRef = ref<HTMLElement | null>(null)
let chart: IChart

// defineProps<{
//   dataset: any[]
// }>()

let timer: NodeJS.Timer

const loading = ref(true)

onMounted(() => {
  chart = createChart(unref(chartRef as Ref<HTMLElement>), {
    color: ['#86DF6C', '#2CAB40'],
    grid: {
      top: '15%', //grid组件距上下左右的距离
      left: '5%',
      right: '5%',
      bottom: '5%',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      show: false,
    },

    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        name: '本月',
        type: 'bar',
        stack: 'Total1',
        // data: [120, 132, 101, 134, 90, 230, 210],
        itemStyle: {
          borderRadius: [2],
        },
      },
      {
        name: '上月',
        type: 'bar',
        stack: 'Total2',
        // data: [94, 172, 51, 110, 80, 210, 26],
        itemStyle: {
          borderRadius: [2],
        },
      },
    ],
  })
  /**
   * 当使用假数据的时候
   */
  let source = initTotalList().records
  chart.setOption({
    dimensions: ['update', 'value', 'value2'],
    dataset: {
      source,
    } as any,
  })
  timer = setInterval(() => {
    source = initTotalList().records
    chart.setOption({
      dataset: {
        source,
      } as any,
    })
  }, 5000)
})
</script>

<style scoped></style>
