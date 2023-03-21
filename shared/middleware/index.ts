import { Router } from 'vue-router'

window.NProgress.configure({
  showSpinner: false,
})

export function setupSharedRouterGuard(router: Router) {
  router.beforeEach(async () => {
    window.NProgress.start()
    return true
  })

  router.afterEach(() => {
    window.NProgress.done()
  })
}
