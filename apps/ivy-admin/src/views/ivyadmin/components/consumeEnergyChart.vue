<!-- 耗能排名 -->
<template>
  <div class="w-full h-full" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, Ref, unref } from 'vue'
import { createChart } from '@ivy/chart'

const chartRef = ref<HTMLElement | null>(null)

onMounted(() => {
  nextTick(() => {
    const chart = createChart(unref(chartRef as Ref<HTMLElement>), {
      color: ['#3491fa', '#0FC6C2'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        // data: ['City Alpha', 'City Beta', 'City Gamma']
        // symbolRotate: '100%'
        icon: 'circle',
        left: 100,
      },
      grid: {
        left: 120,
        bottom: '10%',
        right: '5%',
      },
      // toolbox: {
      //   show: true,
      //   feature: {
      //     saveAsImage: {}
      //   }
      // },
      xAxis: {
        type: 'value',
        // name: 'Days',
      },
      yAxis: {
        type: 'category',
        inverse: true,
        data: [
          '产业园二期B栋3A',
          '产业园二期G栋3A',
          '产业园一期A栋3A',
          '产业园一期F栋',
          '产业园二期G5栋',
        ],
      },
      series: [
        {
          name: '今日',
          type: 'bar',
          data: [165, 170, 30],
          barGap: 0,

          // markPoint: {
          // symbolSize: 1,
          // symbolOffset: [0, '50%'],
          // label: {
          //   formatter: '{a|{a}\n}{b|{b} }{c|{c}}',
          //   backgroundColor: 'rgb(242,242,242)',
          //   borderColor: '#aaa',
          //   borderWidth: 1,
          //   borderRadius: 4,
          //   padding: [4, 10],
          //   lineHeight: 26,
          //   // shadowBlur: 5,
          //   // shadowColor: '#000',
          //   // shadowOffsetX: 0,
          //   // shadowOffsetY: 1,
          //   position: 'right',
          //   distance: 20,
          //   // rich: {
          //   //   a: {
          //   //     align: 'center',
          //   //     color: '#fff',
          //   //     fontSize: 18,
          //   //     textShadowBlur: 2,
          //   //     textShadowColor: '#000',
          //   //     textShadowOffsetX: 0,
          //   //     textShadowOffsetY: 1,
          //   //     textBorderColor: '#333',
          //   //     textBorderWidth: 2
          //   //   },
          //   //   b: {
          //   //     color: '#333'
          //   //   },
          //   //   c: {
          //   //     color: '#ff8811',
          //   //     textBorderColor: '#000',
          //   //     textBorderWidth: 1,
          //   //     fontSize: 22
          //   //   }
          //   // }
          // },
          // data: [
          //   { type: 'max', name: 'max days: ' },
          //   { type: 'min', name: 'min days: ' }
          // ]
          // }
        },
        {
          name: '日平均',
          type: 'bar',
          data: [150, 105, 110],
          barGap: 0,
        },
        // {
        //   name: '产业园一期A栋3A',
        //   type: 'bar',
        //   data: [150, 105, 110]
        // },
        // {
        //   name: '产业园一期F栋',
        //   type: 'bar',
        //   data: [150, 105, 110]
        // },
        // {
        //   name: '产业园二期G5栋',
        //   type: 'bar',
        //   data: [150, 105, 110]
        // },
      ],
    })
  })
})
</script>

<style scoped></style>
