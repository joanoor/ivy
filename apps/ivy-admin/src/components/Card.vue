<template>
  <div
    class="flex flex-col card p-5"
    :style="{ width: boxWidth, height: boxHeight }"
  >
    <ButtonList>
      <template #left>
        <slot name="title-left"></slot>
      </template>
      <template #right>
        <slot name="title-right"></slot>
      </template>
    </ButtonList>
    <slot></slot>
    <slot name="button"></slot>
  </div>
</template>

<script setup lang="ts">
import ButtonList from './ButtonList.vue'
import { isNumber, isString, _console } from '@ivy/core'

const props = withDefaults(
  defineProps<{
    width?: number | string
    height?: number | string
  }>(),
  {
    width: '100%',
    height: '100%',
  }
)

const boxHeight = computed(() => {
  if (isNumber(props.height)) {
    return `${props.height}px`
  } else if (isString(props.height)) {
    return props.height
  } else {
    console.error('height出错了', props.height)
    return '0px'
  }
})

const boxWidth = computed(() => {
  if (isNumber(props.width)) {
    return `${props.width}px`
  } else if (isString(props.width)) {
    return props.width
  } else {
    console.error('width出错了', props.width)
    return '0px'
  }
})
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 4px;
}
</style>
