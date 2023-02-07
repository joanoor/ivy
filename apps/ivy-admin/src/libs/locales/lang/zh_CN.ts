import { genMessage } from '../helper'
import elementLocale from 'element-plus/lib/locale/lang/zh-cn'
import { autoImport } from '@/libs/utils'

// const modules = import.meta.globEager('./zh-CN/**/*.ts')
const modules = autoImport(
  import.meta.glob(['./zh-CN/**/*.ts'], {
    eager: true,
    // query: '?inline',
  })
)
export default {
  message: {
    ...genMessage(modules, 'zh-CN'),
    elementLocale,
  },
}
