<template>
  <p>{{toThousands(count)}}</p>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { toThousands } from '@ivy/core'


const props = withDefaults(defineProps<{
  s?: number
  digit: number
}>(), {
  s: 50,
  digit: 0
})

let dflopTimer: NodeJS.Timer
const digitRef = ref<HTMLSpanElement>()
let step = parseInt(props.digit / props.s + '')
let tmpN = ref(0)  // 临时值，用于计算
let count = ref(0)  // 记录每一次计算的结果，作为下一次的初始值

const flopFunc = () => {
  console.log(`执行flopFunc`,)
  dflopTimer = setInterval(() => {
    if (props.digit > count.value) {

      tmpN.value += step
      if (tmpN.value > props.digit) {
        clearInterval(dflopTimer)
        tmpN.value = props.digit
      }
      if (tmpN.value === count.value) return
      count.value = tmpN.value
    } else if (props.digit < count.value) {
      tmpN.value -= step
      if (tmpN.value < props.digit) {
        clearInterval(dflopTimer)
        tmpN.value = props.digit
      }
      if (tmpN.value === count.value) return
      count.value = tmpN.value
    }
  }, props.s)
}

onMounted(flopFunc)
watch(() => props.digit, flopFunc)
</script>

<style scoped>
p {
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>