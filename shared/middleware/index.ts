import { Router } from 'vue-router'
import { Persistent } from '../utils/cache/persistent'
import { _console } from '@ivy/core'

// 不需要token的页面
const WHITE_ROUTELIST = window.config.whiteList

window.NProgress.configure({
  showSpinner: false,
})

export function setupRouterGuard(router: Router) {
  router.beforeEach(async to => {
    window.NProgress.start()

    if (Persistent.getLocal('__TOKEN__')) {
      if (to.path === '/login') return true
      else return true
    } else {
      if (WHITE_ROUTELIST.indexOf(to.path) > -1) {
        return true
      } else
        return {
          path: '/login',
        }
    }
  })

  router.afterEach(() => {
    window.NProgress.done()
  })
}
