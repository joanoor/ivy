import { createApp } from 'vue'
import App from './App.vue'
import { router, setupRouter } from './router' // 路由
import { setupRouterGuard } from './middleware' // 路由导航守卫
import { setupStyles } from './styles' // 样式
import { setupStore } from './store' // pinia
import { registerGlobComp } from './components'
import { setupPlugins } from './plugins' // 插件
import { setupGlobDirectives } from './directives'
import { setupErrorHandle } from '@/libs/error' // 错误处理
import { setupI18n } from './libs/locales/setupI18n'

// 仿nest.js启动
async function bootstrap() {
  const app = createApp(App)

  // 配置 store
  setupStore(app)

  // 注册全局组件
  registerGlobComp(app)

  // 配置路由
  setupRouter(app)

  // 路由导航守卫
  setupRouterGuard(router)

  // 多语言配置
  // 异步案例：语言文件可能从服务器端获取
  await setupI18n(app)

  // 注册全局指令
  setupGlobDirectives(app)

  // 注册第三方及第三方插件或组件
  setupPlugins(app)

  // 样式
  setupStyles()

  // 配置全局错误处理
  setupErrorHandle(app)

  app.mount('#app')
}

bootstrap()
