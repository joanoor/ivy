<template>
  <div class="w-full h-full chart-container">
    <el-empty
      v-if="chartData.length === 0"
      class="w-full h-full"
      description="暂无图表"
    />
    <div ref="chartRef" class="w-full h-full" v-else></div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    chartData: Recordable[]
  }>(),
  {}
)
</script>

<style scoped></style>
