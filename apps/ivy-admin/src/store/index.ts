import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const store = createPinia()
store.use(piniaPluginPersistedstate)

export function setupStore(app: App<Element>) {
  app.use(store)
}

export * from './modules/globals'
export * from './modules/user'
export * from './modules/permission'
export * from './modules/app'
