import { Router } from 'vue-router'
import { useGlobalStore } from '@/store'
import { isEmpty } from '@ivy/core'

window.NProgress.configure({
  showSpinner: false,
})

export function setupRouterGuard(router: Router) {
  router.beforeEach(async () => {
    window.NProgress.start()
    const useGlobal = useGlobalStore()
    isEmpty(useGlobal.dicts) && useGlobal.getDicts()

    isEmpty(useGlobal.supervisionOrgs) && useGlobal.getSupervisionOrgs()
    isEmpty(useGlobal.verificationOrgs) && useGlobal.getVerificationOrgs()
    isEmpty(useGlobal.areas) && useGlobal.getAreas()
    return true
  })

  router.afterEach(() => {
    window.NProgress.done()
  })
}
