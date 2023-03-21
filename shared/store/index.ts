import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const store = createPinia()

// 注册持久化插件
store.use(piniaPluginPersistedstate)

export function setupSharedStore(app: App<Element>) {
  app.use(store)
}

export * from './modules/app'
export * from './modules/errorLog'
export * from './modules/globals'
export * from './modules/locale'
export * from './modules/permission'
