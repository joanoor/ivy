import { Router } from 'vue-router'
import store2 from 'store2'
import { SYS_CONSTANT } from '@/libs/shared/constant'
import { useGlobalStore, useUserStore, usePermissionStore } from '@/store'
import { isEmpty, _console } from '@ivy/core'
// import { isEmpty } from '@ivy/core'

// 可以不需要token的页面
const WHITE_ROUTELIST = window.config.whiteList

window.NProgress.configure({
  showSpinner: false,
})

export function setupRouterGuard(router: Router) {
  router.beforeEach(async to => {
    window.NProgress.start()
    // if (store.get(SYS_CONSTANT.AUTH_TOKEN)) {
    //   const useGlobal = useGlobalStore()
    //   const useUser = useUserStore()
    //   const usePermission = usePermissionStore()
    //   // 当token存在的时候
    //   if (to.path === '/login') {
    //     return {
    //       path: '/',
    //     }
    //   } else {
    //     if (isEmpty(useUser.userInfo)) {
    //       // 当用户信息为空的时候
    //       useGlobal.getServerTime()
    //       await useUser.getUserInfo()
    //       await usePermission.getRoutes()
    //       if (to.path === '/') {
    //         // 当路径为“/”的时候，重定向到默认的导航路径
    //         return {
    //           path: usePermission.defaultRouter,
    //         }
    //       } else {
    //         return {
    //           path: to.fullPath,
    //         }
    //       }
    //     } else {
    //       if (to.path === '/') {
    //         // 当路径为“/”的时候，重定向到默认的导航路径
    //         return {
    //           path: usePermission.defaultRouter,
    //         }
    //       } else {
    //         return true
    //       }
    //     }
    //   }
    // } else {
    //   if (WHITE_ROUTELIST.indexOf(to.path) > -1) {
    //     // 在免登录白名单中，直接进入
    //     return true
    //   } else {
    //     return {
    //       path: '/login',
    //     }
    //   }
    // }
    // const useGlobal = useGlobalStore()
    // try {
    //   if (isEmpty(useGlobal.dicts)) {
    //     await useGlobal.getDicts()
    //   }
    //   if (isEmpty(useGlobal.orgList) || isEmpty(useGlobal.orgTree)) {
    //     await useGlobal.getAllOrg()
    //   }
    // } catch (err) {
    //   _console.error('middleware中请求出错')
    //   console.error(err)
    // }
    if (store2.get(SYS_CONSTANT.AUTH_TOKEN)) {
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
