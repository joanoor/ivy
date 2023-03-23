import { cloneDeep } from '@ivy/core'
import type {
  App,
  Component,
  ComputedOptions,
  MethodOptions,
  Plugin,
} from 'vue'

/**
 * vite环境下的自动导入
 * @param files const files=import.meta.glob('./*.ts',{eager:true})
 * @returns
 */
export const autoImport = (files: Record<string, unknown>) => {
  const modules: Recordable = {}
  for (const key in files) {
    if (Object.prototype.hasOwnProperty.call(files, key)) {
      modules[key.replace(/(\.\/|\.ts)/g, '')] = files[key]
    }
  }
  return modules
}

export const withInstall = <
  T extends Component<any, any, any, ComputedOptions, MethodOptions>
>(
  component: T,
  alias?: string
) => {
  const comp = component as any
  comp.install = (app: App) => {
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}
