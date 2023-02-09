import { autoImport } from '@/libs/utils'
import { isFunction } from '@ivy/core'
import { App } from 'vue'
import SvgIcon from '~virtual/svg-component'

const modules = autoImport(
  import.meta.glob(['./**/index.ts', '!./index.ts'], { eager: true })
)

export async function setupPlugins(app: App<Element>) {
  app.component(SvgIcon.name, SvgIcon)

  Object.keys(modules).forEach(key => {
    const module = modules[key].default
    isFunction(module) && module(app)
  })
}
