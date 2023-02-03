/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vite/client" />

import type {
  VNodeChild,
  ComponentPublicInstance,
  FunctionalComponent,
  PropType as VuePropType,
} from 'vue'

declare module 'vue' {
  export type JSXComponent<Props = any> =
    | { new(): ComponentPublicInstance<Props> }
    | FunctionalComponent<Props>
}

type PowerFunc = {
  easeIn: AnyFunction
  easeInOut: AnyFunction
  easeOut: AnyFunction
}

declare global {
  interface Window {
    NProgress: typeof import('nprogress')
    dayjs: typeof import('dayjs')
    readonly config: {
      projectName: string
      whiteList: string[]
      uaa_url: string
      project_url: string
      basic_url: string
      [propName: string]: string | string[]
    }
    intervalTimer: NodeJS.Timer
    /************gsap动画************/
    gsap: typeof import('gsap')
    Flip: typeof import('gsap/Flip').Flip
    Power0: PowerFunc & {
      easeNone: AnyFunction
    }
    Power1: PowerFunc
    Power2: PowerFunc
    Power3: PowerFunc
    Power4: PowerFunc
  }

  // vue


  // VITE环境配置
  interface ViteEnv {
    VITE_PORT: number
    VITE_USE_MOCK: boolean
    VITE_USE_PWA: boolean
    VITE_PUBLIC_PATH: string
    VITE_PROXY: [string, string][]
    VITE_GLOB_APP_TITLE: string
    VITE_GLOB_APP_SHORT_NAME: string
    VITE_USE_CDN: boolean
    VITE_DROP_CONSOLE: boolean
    VITE_BUILD_COMPRESS: 'gzip' | 'brotliCompress' | 'deflate' | 'deflateRaw'
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean
    VITE_LEGACY: boolean
    VITE_USE_IMAGEMIN: boolean
    VITE_GENERATE_UI: string
  }
}

interface ImportMetaEnv extends ViteEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_BASEAPI_DEV: string
  readonly VITE_APP_BASEAPI_PROD: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
