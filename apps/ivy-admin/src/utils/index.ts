import { ResultAreaStruct } from '@/api/dossier/model'
import { cloneDeep, isNullOrUnDef } from '@ivy/core'
import type {
  App,
  Component,
  ComputedOptions,
  MethodOptions,
  Plugin,
} from 'vue'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import { RouteLocationRaw, Router } from 'vue-router'

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

export const getAreaPath = (
  areaList: ResultAreaStruct[],
  areaNo: string,
  path = ''
) => {
  const item = areaList.find(v => v.areaNo === areaNo)
  if (item) {
    path = item.areaName + path
    return isNullOrUnDef(item.parentAreaNo)
      ? getAreaPath(areaList, item.parentAreaNo, path)
      : getAreaPath(areaList, item.parentAreaNo, '/' + path)
  }
  return path
}

export const jumpTo = (router: Router, path: RouteLocationRaw) => {
  router.push(path)
}

export const seePic = (url: string) => {
  const image = new Image()
  image.src = url
  const viewer = new Viewer(image, {
    hidden: function () {
      viewer.destroy()
    },
    navbar: false,
    toolbar: false,
  })
  viewer.show()
}

export const getPreviewUrl = (ablob: any) => {
  let blob = ''
  if (typeof ablob == 'object' && ablob instanceof Blob) {
    blob = URL.createObjectURL(ablob) // 创建blob地址
  }
  return blob
}
