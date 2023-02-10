import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const store = createPinia()

// 持久化
store.use(piniaPluginPersistedstate)

export function setupStore(app: App<Element>) {
  app.use(store)
}

export * from './modules/app'
export * from './modules/errorLog'
export * from './modules/globals'
export * from './modules/locale'
export * from './modules/permission'
export * from './modules/user'
