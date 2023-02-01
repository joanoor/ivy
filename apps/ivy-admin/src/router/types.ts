import { RequestEnum } from '@ivy/request'
import { defineComponent } from 'vue'
import type { RouteRecordRaw, RouteMeta } from 'vue-router'

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

type ResourceType = 'button'
type RequestType =
  | RequestEnum.GET
  | RequestEnum.POST
  | RequestEnum.DELETE
  | RequestEnum.PUT

export interface Elements {
  resourceCode: string
  resourceName: string
  resourceType: ResourceType
  requestUrl?: string
  requestType?: RequestType
}

export interface AppRouteRecordRaw
  extends Omit<RouteRecordRaw, 'meta' | 'children' | 'path'> {
  name?: string
  meta?: RouteMeta
  elements?: Elements[]
  path?: string
  component: Component | string
  components?: Component
  children?: AppRouteRecordRaw[]
  props?: Recordable
  fullPath?: string
}

export interface AsyncRouter {
  [x: string]: AppRouteRecordRaw
}

export interface Menu {
  name: string
  [prop: string]: any
}
