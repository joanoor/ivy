import { createApp } from 'vue'
import App from './App.vue'
import { router, setupRouter } from './router' // 路由
import { setupRouterGuard } from './middleware' // 路由导航守卫
import { setupStyles } from './styles' // 样式
import { setupStore } from './store' // pinia
import { registerGlobComp } from '@shared/components' // 全局组件
import { setupGlobDirectives } from '@shared/directives' // 全局指令
import { setupErrorHandle } from '@shared/utils/error-handler' // 错误处理

// 仿nest.js启动
async function bootstrap() {
  const app = createApp(App)

  // 配置 store
  setupStore(app)

  // 配置路由
  setupRouter(app)

  // 路由导航守卫
  setupRouterGuard(router)

  // 样式
  setupStyles()

  // 注册全局组件
  registerGlobComp(app)

  // 注册全局指令
  setupGlobDirectives(app)

  // 配置全局错误处理
  setupErrorHandle(app)

  app.mount('#app')
}

bootstrap()
