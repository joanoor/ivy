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

export const changeToTree = (
  d: Recordable[],
  key = 'id',
  pkey = 'parentId'
) => {
  const ckey = 'children'
  const data = cloneDeep(d)
  let flag = false // 字段保证顺序是否变化
  if (!key || !data) return []

  let tree = []
  const names: string[] = []
  const parents: Recordable = {}
  data.forEach(item => {
    names.push(item[key] + '_')
    // 父类相同的分类
    parents[item[pkey] + '_'] = parents[item[pkey] + '_'] || []
    parents[item[pkey] + '_'].push(item)
  })
  data.forEach(item => {
    if (parents[item[key] + '_'] && item[pkey] !== item[key]) {
      flag = true
      item[ckey] = [...parents[item[key] + '_']]
    }
  })
  // 保证顺序不能变(前提是：没有子节点)
  if (flag) {
    // 获取根节点
    for (const keyName in parents) {
      if (names.indexOf(keyName) < 0) {
        tree.push(...parents[keyName])
      }
    }
  } else {
    tree = cloneDeep(data)
  }
  return tree
}

export const arrayChangeToObj = (d: Recordable[], key: string) => {
  if (!d) return {}
  const data = cloneDeep(d)
  return data.reduce((acc, cur) => {
    acc[cur[key]] = cur
    return acc
  }, {})
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
