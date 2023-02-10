import { createApp } from 'vue'
import App from './App.vue'
import { router, setupRouter } from './router' // 路由
import { setupRouterGuard } from '@shared/middleware' // 路由导航守卫
import { setupStyles } from '@shared/styles' // 样式
import { setupStore } from '@shared/store' // pinia
import { registerGlobComp } from '@shared/components'
import { setupGlobDirectives } from '@shared/directives'
import { setupErrorHandle } from '@shared/utils/error-handler' // 错误处理

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

  // 注册全局指令
  setupGlobDirectives(app)

  // 样式
  setupStyles()

  // 配置全局错误处理
  setupErrorHandle(app)

  app.mount('#app')
}

bootstrap()
