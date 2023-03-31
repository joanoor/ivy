<template>
  <div class="treebox" :style="{ width: width, height: height }">
    <div class="treebox-title" flex items-center font-600 truncate>
      {{ title }}
    </div>
    <div class="treebox-bottom" pl-2.5 pr-2.5>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    width?: string
    height?: string
  }>(),
  {
    width: '100%',
    height: '100%',
  }
)
</script>

<style scoped lang="scss">
.treebox {
  border: solid 1px #e5e6eb;
  .treebox-title {
    height: 40px;
    background: #f7f8fa;
    padding-left: 10px;
  }
  .treebox-bottom {
    padding: 12px 8px;
  }
}
</style>
