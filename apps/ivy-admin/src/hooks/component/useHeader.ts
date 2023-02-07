import { debounce } from '@ivy/core'
import { onMounted, ref } from 'vue'
const marginRight = 48
export default function () {
  const project = ref<HTMLElement>()
  const system = ref<any>()

  const width = ref<number>(0)

  function changeWidth() {
    if (project.value && system.value) {
      const childSystem: HTMLElement = system.value?.setting as HTMLElement

      const tWidth =
        project.value.offsetWidth + childSystem.offsetWidth + 110 + marginRight
      const clientWidth = document.body.clientWidth
      if (clientWidth > 1600) {
        width.value = clientWidth - tWidth
      } else {
        width.value = 1600 - tWidth
      }
    }
  }

  // 生成防抖函数
  const newDebounce = debounce(changeWidth, 500)

  onMounted(() => {
    changeWidth()
    window.addEventListener('resize', newDebounce, false)
  })

  return {
    project,
    system,
    width,
  }
}
