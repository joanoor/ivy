/**
 * 与弹框相关的操作
 * 包括打开dialog、关闭弹框，重置表单
 */

import { reactive, toRefs } from 'vue'

/**
 * 设置dialog弹框相关
 */
export default function () {
  const data = reactive({
    dialogVisiable: false, // 弹框是否打开
    dialogTitle: '', // 弹框的标题
  })

  const onCallbackDialog = (callback?: () => void) => {
    callback && callback()
  }

  return {
    ...toRefs(data),
    onCallbackDialog,
  }
}
