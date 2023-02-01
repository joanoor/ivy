import { onMounted, onUnmounted, ref } from 'vue'

export default function () {
  let timer: NodeJS.Timer
  const realTime = ref(window.dayjs().format('YYYY.MM.DD HH:mm'))
  onMounted(() => {
    timer = setInterval(() => {
      realTime.value = window.dayjs().format('YYYY.MM.DD HH:mm')
    }, 1000)
  })
  onUnmounted(() => {
    clearInterval(timer)
  })
  return {
    realTime,
  }
}
