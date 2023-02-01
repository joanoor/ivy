import { ref, onMounted } from 'vue'

export default function () {
  const mode = ref<'vertical' | 'horizontal'>('vertical')
  const height = ref(0)

  onMounted(async () => {
    const formDom: HTMLDivElement = document.querySelector(
      '.searchForm'
    ) as HTMLDivElement
    const result = formDom?.querySelectorAll('.el-row')
    if (result) {
      result.length > 1
        ? (mode.value = 'vertical')
        : (mode.value = 'horizontal')
      height.value = formDom.offsetHeight
    }
  })

  return {
    mode,
    height,
  }
}
