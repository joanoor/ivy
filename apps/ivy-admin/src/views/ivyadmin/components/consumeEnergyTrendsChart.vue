<template>
  <div class="w-full h-full" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, Ref, unref, watchEffect } from 'vue'
import { createChart } from '@ivy/chart'

const chartRef = ref<HTMLElement | null>(null)

onMounted(() => {
  nextTick(() => {
    createChart(
      unref(chartRef as Ref<HTMLElement>),
      {
        color: ['#3491fa', '#0FC6C2'],
        grid: {
          top: '20%', //grid组件距上下左右的距离
          left: '5%',
          right: '5%',
          bottom: '13%',
        },
        legend: {
          // data: ['City Alpha', 'City Beta', 'City Gamma']
          // symbolRotate: '100%'
          icon: 'circle',
        },
        // dataset: {
        //   dimensions: ['update', 'value'],
        //   source: [
        //     {
        //       update: 'Mon', value: '120'
        //     }
        //   ]
        // },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
          // show: false
        },
        yAxis: [
          {
            name: 'kWh',
            type: 'value',
            nameTextStyle: {
              padding: [0, 0, 0, -35], // 四个数字分别为上右下左与原位置距离
            },
            // show: false
          },
          {
            name: 'm³',
            type: 'value',
            nameTextStyle: {
              padding: [0, 0, 0, 25], // 四个数字分别为上右下左与原位置距离
            },
            // show: false
          },
        ],
        series: [
          {
            name: '用电量',
            yAxisIndex: 0,
            type: 'line',
            smooth: true,
            symbol: 'none',
            stack: 'Total1',
            data: [220, 182, 191, 234, 290, 330, 310, 191, 234, 290, 330, 310],
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(22,93,255,0.20)', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(22,93,255,0.00)', // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
          {
            name: '用水量',
            yAxisIndex: 1,
            type: 'line',
            stack: 'Total2',
            smooth: true,
            symbol: 'none',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(20,201,201,0.20)', // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(20,201,201,0.00)', // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
            data: [
              120, 132, 101, 134, 90, 230, 210, 132, 101, 134, 90, 230, 210,
            ],
          },
        ],
      },
      {
        isRealRefresh:true
      }
    )
  })
})
</script>

<style scoped></style>
