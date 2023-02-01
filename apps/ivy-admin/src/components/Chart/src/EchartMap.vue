<template>
  <div class="w-full h-full chart-container">
    <div ref="chartRef" class="w-full h-full"></div>
  </div>
</template>

<script setup lang="ts">
import { http } from '@/plugins/request'
import { onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    chartData: Recordable[]
  }>(),
  {}
)
onMounted(() => {
  http
    .get(
      {
        url: `./geojson/340000.json`,
      },
      {
        isTransformResponse: false,
      }
    )
    .then(res => {
      console.log(`----------------`, res)
    })
})
</script>

<style scoped></style>
