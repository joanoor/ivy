import { ElMessage } from 'element-plus'
import useClipboard from 'vue-clipboard3'

export default function () {
  const { toClipboard } = useClipboard()
  const copy = (text: string) => {
    console.log('开始复制了吗', text)
    toClipboard(text)
      .then(() => {
        console.log('开始复制了吗22222')
        ElMessage.success('复制成功')
      })
      .catch(err => {
        console.log(err)
      })
  }

  return { copy }
}
