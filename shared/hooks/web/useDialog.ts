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
    confirmWord: '创建',
    cancelWord: '取消',
  })

  watchEffect(() => {
    if (data.dialogTitle.includes('编辑')) {
      data.confirmWord = '更新'
    } else {
      data.confirmWord = '创建'
    }
  })

  const onCallbackDialog = (callback?: () => void) => {
    callback && callback()
  }

  return {
    ...toRefs(data),
    onCallbackDialog,
  }
}
