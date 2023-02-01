import { cloneDeep, isFunction, isPlainObject } from '@ivy/core'
import { utils, WorkBook, write } from 'xlsx'
import type {
  App,
  Component,
  ComputedOptions,
  MethodOptions,
  Plugin,
} from 'vue'

// const files=import.meta.glob('./*.ts',{eager:true})
export const autoImport = (files: Record<string, unknown>) => {
  const modules: Recordable = {}
  for (const key in files) {
    if (Object.prototype.hasOwnProperty.call(files, key)) {
      modules[key.replace(/(\.\/|\.ts)/g, '')] = files[key]
    }
  }
  return modules
}

export const downloadTemplate = (type: string) => {
  window.open(
    `http://10.138.220.34:5553/dossier/allequip/downloadmodel?modelType=${type}`
  )
}

// export const downloadExcel = async (
//   total: number,
//   tableHeaders: ResultColumnsData[],
//   aUrl: URLType = 'orginformation'
// ) => {
//   const { result } = await getList(
//     {
//       page: {
//         current: 1,
//         size: total,
//       },
//     },
//     aUrl
//   )
//   console.log(`我看下=====>`, result)
//   let sheet1 = utils.json_to_sheet(result.records)
//   let jsonSheet1 = JSON.stringify(sheet1)
//   tableHeaders.forEach(v => {
//     // 这一步是将英文转成中文
//     jsonSheet1 = jsonSheet1.replace(v.name, v.title)
//   })
//   sheet1 = JSON.parse(jsonSheet1)
//   const wb = utils.book_new()
//   utils.book_append_sheet(wb, sheet1, 'sheet1')
//   const workbookBlob = workbook2blob(wb)
//   download(workbookBlob, '计量表统计.xlsx')
// }

const workbook2blob = (workbook: WorkBook) => {
  const wbout = write(workbook, {
    // 要生成的文件类型
    bookType: 'xlsx',
    // // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    bookSST: false,
    type: 'binary',
  })
  // 将字符串转ArrayBuffer
  function s2ab(s: any) {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
    return buf
  }
  const blob = new Blob([s2ab(wbout)], {
    type: 'application/octet-stream',
  })
  return blob
}

const download = (ablob: any, fileName: string) => {
  let blob = ''
  if (typeof ablob == 'object' && ablob instanceof Blob) {
    blob = URL.createObjectURL(ablob) // 创建blob地址
  }
  const aLink = document.createElement('a')
  aLink.href = blob
  // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，有时候 file:///模式下不会生效
  aLink.download = fileName || ''
  let event
  if (window.MouseEvent) event = new MouseEvent('click')
  //   移动端
  else {
    event = document.createEvent('MouseEvents')
    event.initMouseEvent(
      'click',
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    )
  }
  aLink.dispatchEvent(event)
}
// 参见：https://juejin.cn/post/6844903880413675527

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
