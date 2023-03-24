/**
 * 与弹框相关的操作
 * 包括打开dialog、关闭弹框，重置表单
 */

import { reactive, toRefs } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { useRoute } from 'vue-router'

interface IntTab {
  label: string
  name: string
}

/**
 * 设置dialog弹框相关
 */
export default function (tabs: IntTab[] = [], callback?: Fn) {
  const route = useRoute()
  const data = reactive({
    activeTabName: '', // 弹框是否打开
    tabList: [] as IntTab[],
  })

  data.tabList = tabs

  if (tabs.length > 0) {
    // @ts-ignore
    data.activeTabName = route.query['activeTabName'] ?? tabs[0].name
  }

  const handleTabClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
    // data.activeTabName=tab.paneName
  }

  watch(
    () => data.activeTabName,
    () => {
      callback && callback()
    }
  )

  return {
    ...toRefs(data),
    handleTabClick,
  }
}
