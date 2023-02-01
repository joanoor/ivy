import { onMounted, ref, watch, Ref } from 'vue'

export default function (digit: Ref<number>, s = 50) {
  let dflopTimer: NodeJS.Timer
  let step = parseInt(digit.value / s + '')
  const tmpN = ref(0) // 临时值，用于计算
  const count = ref(0) // 记录每一次计算的结果，作为下一次的初始值

  const flopFunc = () => {
    dflopTimer = setInterval(() => {
      if (digit.value > count.value) {
        tmpN.value += step
        if (tmpN.value > digit.value) {
          clearInterval(dflopTimer)
          tmpN.value = digit.value
        }
      } else if (digit.value < count.value) {
        tmpN.value -= step
        if (tmpN.value < digit.value) {
          clearInterval(dflopTimer)
          tmpN.value = digit.value
        }
      }
      if (tmpN.value === count.value) return
      count.value = tmpN.value
    }, s)
  }

  onMounted(flopFunc)
  watch(digit, () => {
    step = parseInt(digit.value / s + '')
    flopFunc()
  })
  return {
    count,
  }
}
