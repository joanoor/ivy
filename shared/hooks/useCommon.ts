import { computed } from 'vue'

export default function () {
  // 欢迎语句
  const timeSayHello = computed(() => {
    const date = new Date().getHours()
    let hoursTip = ''
    if (date >= 0 && date < 12) {
      hoursTip = '上午好'
    } else if (date >= 12 && date < 18) {
      hoursTip = '下午好'
    } else {
      hoursTip = '晚上好'
    }
    return hoursTip
  })

  // 项目名称
  const projectName = computed(() => `${window.config.projectName}`)

  return {
    timeSayHello,
    projectName,
  }
}
