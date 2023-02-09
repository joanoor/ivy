import { genMessage } from '../helper'
import elementLocale from 'element-plus/lib/locale/lang/en'
import { autoImport } from '@/libs/utils'

const modules = autoImport(import.meta.glob(['./en/**/*.ts'], { eager: true }))
export default {
  message: {
    ...genMessage(modules, 'en'),
    elementLocale,
  },
  dateLocale: null,
  dateLocaleName: 'en',
}
