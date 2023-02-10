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
      color: ['#722ED1', '#F7BA1E', '#0FC6C2', '#3491FA'],
      grid: {
        top: '0%',  //grid组件距上下左右的距离
        left: "5%",
        right: "5%",
        bottom: "0%",
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['70%', '92%'],
          avoidLabelOverlap: true,
          // label: {
          //   show: false,
          //   position: 'center'
          // },
          // emphasis: {
          //   label: {
          //     show: true,
          //     fontSize: '40',
          //     fontWeight: 'bold'
          //   }
          // },
          // labelLine: {
          //   show: true
          // },
          data: [
            { value: 1048, name: '空调用电' },
            { value: 735, name: '照明用电' },
            { value: 580, name: '充电桩用电' },
            { value: 484, name: '其他用电' },
          ]
        }
      ]
    })

  })
})
</script>

<style scoped>

</style>