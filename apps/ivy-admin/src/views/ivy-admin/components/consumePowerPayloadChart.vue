<template>
  <div class="w-full h-full" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, Ref, unref } from 'vue';
import { createChart } from '@ivy/chart'

const chartRef = ref<HTMLElement | null>(null)

onMounted(() => {
  nextTick(() => {

    const chart = createChart(unref(chartRef as Ref<HTMLElement>), {
      grid: {
        top: '0%',  //grid组件距上下左右的距离
        left: "0%",
        right: "0%",
        bottom: "0%",
      },

      title: {
        text: '最大负荷',
        // textAlign: 'center',
        left: 'center',
        bottom: '21%',
        textStyle: {
          fontSize: 20,
          color: '#4E5969',
          fontFamily: ' PingFang SC, PingFang SC-Regular',
          fontWeight: 500
        }
      },
      series: [
        {
          type: 'gauge',
          radius: '80%',
          axisLine: {
            lineStyle: {
              width: 12,
              color: [
                [0.3, '#67e0e3'],
                [0.7, '#37a2da'],
                [1, '#fd666d']
              ]
            }
          },
          axisTick: {
            length: 4
          },
          center: ['50%', '40%'],
          pointer: {
            itemStyle: {
              color: 'red',
              borderMiterLimit: 5
            },
            offsetCenter: ['0%', '0'],
            width: 19,
            // length: '100%',
            keepAspect: true,
            icon: 'path://M6 0C5.44772 0 5 0.447715 5 1V30.083C2.16229 30.559 0 33.027 0 36C0 39.3137 2.68629 42 6 42C9.31371 42 12 39.3137 12 36C12 33.027 9.83771 30.559 7 30.083V1C7 0.447715 6.55228 0 6 0ZM6 32C3.79086 32 2 33.7909 2 36C2 38.2091 3.79086 40 6 40C8.20914 40 10 38.2091 10 36C10 33.7909 8.20914 32 6 32Z'
          },
          // anchor: {
          //   show: true
          // },

          // axisLabel: {
          //   color: 'auto',
          //   distance: 40,
          //   fontSize: 20
          // },
          detail: {
            valueAnimation: true,
            formatter: '{value} kW',
            offsetCenter: [0, '112  %'],
            color: '#F7BA1E',
            fontSize: 24,
            fontWeight: 600
          },
          data: [
            {
              value: 2049.38
            }
          ]
        }
      ]
    })

  })
})
</script>

<style scoped>

</style>