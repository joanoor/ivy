import { cloneDeep } from '@ivy/core'
import type {
  App,
  Component,
  ComputedOptions,
  MethodOptions,
  Plugin,
} from 'vue'

/**
 * vite环境下的自动导入（用于vue3）
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

export const judgeWord = (aform: Recordable) => {
  const form = cloneDeep(aform)
  Object.keys(form).forEach(v => {
    if (form[v] !== 0) {
      if (!form[v]) {
        delete form[v]
      }
    }
  })
  return form
}

export const isDisableData = (date: Date) => {
  return (
    window.dayjs().unix() < window.dayjs(date).unix() ||
    window.dayjs(date).unix() < window.dayjs('2022-01-01').unix()
  )
}

/**
 * webpack项目自动引入某一目录下js|ts文件或者样式文件（用于vue2）
 * @param files require.context
 * @param typeName script 表示js文件，style 表示样式文件，mixin 表示全局混入
 * @param ignores 表示忽略的文件，哪些不需要自动引入的文件，写在这里
 *
 * @deprecated
 */
/* istanbul ignore next */
// export function autoImport2(
//   files: __WebpackModuleApi.RequireContext,
//   typeName: 'script' | 'style' | 'mixin',
//   ignores?: string[]
// ): any {
//   const result: unknown[] = []
//   const funcObj: Recordable = {}
//   files.keys().forEach(file => {
//     if (typeName === fileType.ISSCRIPT) {
//       const fileName: string =
//         file
//           ?.split('/')
//           ?.pop()
//           ?.replace(/\.\w+$/, '') ?? ''
//       if (!ignores || ignores.indexOf(fileName) === -1) {
//         const jsConfig = files(file)
//         funcObj[fileName] = jsConfig?.default
//       }
//     } else if (typeName === fileType.ISCSS) {
//       /* 引入样式文件 */
//       const _tmps: string[] = file.split('/')
//       if (_tmps?.length > 0) {
//         if (!ignores || ignores.indexOf(_tmps[_tmps.length - 1]) !== -1)
//           files(file)
//       }
//     } else if (typeName === fileType.ISMIXINS) {
//       /* 自动混入全局（专用于vue） */
//       const fileName: string =
//         file
//           ?.split('/')
//           ?.pop()
//           ?.replace(/\.\w+$/, '') ?? ''
//       if (!ignores || ignores.indexOf(fileName) === -1) {
//         result.push(files(file)?.default || files(file))
//       }
//     }
//   })

//   return typeName === fileType.ISMIXINS ? result : funcObj
// }
