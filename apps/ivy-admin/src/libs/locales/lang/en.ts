import { genMessage } from '../helper'
import elementLocale from 'ant-design-vue/es/locale/en_US'

const modules = import.meta.globEager('./en/**/*.ts')
export default {
  message: {
    ...genMessage(modules, 'en'),
    elementLocale,
  },
  dateLocale: null,
  dateLocaleName: 'en',
}
