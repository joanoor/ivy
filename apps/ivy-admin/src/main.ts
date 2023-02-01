import { createApp } from 'vue'
import App from './App.vue'
import { router, setupRouter } from './router' // 路由
import { setupRouterGuard } from './middleware' // 路由导航守卫
import { setupStyles } from './styles' // 样式
import { setupStore } from './store' // pinia
import { setupPlugins } from './plugins' // 插件

/**
 * Handling error stack information
 * @param error
 */
function processStackMsg(error: Error) {
  if (!error.stack) {
    return ''
  }
  let stack = error.stack
    .replace(/\n/gi, '') // Remove line breaks to save the size of the transmitted content
    .replace(/\bat\b/gi, '@') // At in chrome, @ in ff
    .split('@') // Split information with @
    .slice(0, 9) // The maximum stack length (Error.stackTraceLimit = 10), so only take the first 10
    .map(v => v.replace(/^\s*|\s*$/g, '')) // Remove extra spaces
    .join('~') // Manually add separators for later display
    .replace(/\?[^:]+/gi, '') // Remove redundant parameters of js file links (?x=1 and the like)
  const msg = error.toString()
  if (stack.indexOf(msg) < 0) {
    stack = msg + '@' + stack
  }
  return stack
}

/**
 * get comp name
 * @param vm
 */
function formatComponentName(vm: any) {
  if (vm.$root === vm) {
    return {
      name: 'root',
      path: 'root',
    }
  }

  const options = vm.$options as any
  if (!options) {
    return {
      name: 'anonymous',
      path: 'anonymous',
    }
  }
  const name = options.name || options._componentTag
  return {
    name: name,
    path: options.__file,
  }
}

// function setupErrorHandle(
//   err: Error,
//   vm: ComponentPublicInstance | null,
//   info: string
// ) {
//   const errorLogStore
// }

// 仿nest.js启动
async function bootstrap() {
  const app = createApp(App)
  setupStore(app)
  setupRouter(app)
  setupRouterGuard(router)
  setupPlugins(app)
  setupStyles()
  app.mount('#app')
}

bootstrap()
