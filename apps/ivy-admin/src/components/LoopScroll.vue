<template>
  <div
    class="loopscroll overflow-hidden"
    ref="parentRef"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div ref="childRef">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const parentRef = ref<HTMLElement | null>(null)
const childRef = ref<HTMLElement | null>(null)
let intervalTimer: NodeJS.Timer

onMounted(() => {
  initScroll(parentRef.value as HTMLElement, childRef.value as HTMLElement)
})

const initScroll = (parent: HTMLElement, child: HTMLElement) => {
  const $children = child?.children
  if ($children && $children.length > 0) {
    const $parentHeight = child?.parentElement?.offsetHeight
    const $elHeight = child?.scrollHeight
    if ($elHeight && $parentHeight) {
      if ($elHeight > $parentHeight) {
        intervalTimer = setInterval(() => {
          if (parent.scrollTop >= $children[0].clientHeight + 8) {
            // 这里的8是margin-top
            child.append(child.removeChild($children[0]))
          } else {
            parent.scrollTop++
          }
        }, 50)
      }
    }
  }
}

const handleMouseEnter = () => {
  clearInterval(intervalTimer)
}

const handleMouseLeave = () => {
  initScroll(parentRef.value as HTMLElement, childRef.value as HTMLElement)
}
</script>

<style lang="scss" scoped>
.loopscroll {
  // transition: 0.5s;
}
</style>
