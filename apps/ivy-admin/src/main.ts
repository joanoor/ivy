import { createApp } from 'vue'
import App from './App.vue'
import { router, setupRouter } from './router' // 路由
import { setupRouterGuard } from './middleware' // 路由导航守卫
import { setupStyles } from './styles' // 样式
import { setupStore } from './store' // pinia
import { setupPlugins } from './plugins' // 插件
import { setupGlobDirectives } from './directives'
import { setupErrorHandle } from '@/libs/error' // 错误处理

// 仿nest.js启动
async function bootstrap() {
  const app = createApp(App)
  setupStore(app)
  setupRouter(app)
  setupRouterGuard(router)
  setupPlugins(app)
  setupStyles()
  setupErrorHandle(app)
  setupGlobDirectives(app)
  app.mount('#app')
}

bootstrap()
