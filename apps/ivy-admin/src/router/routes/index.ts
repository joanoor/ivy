import { AppRouteRecordRaw } from '../types'

// 路由白名单
export const WHITE_NAME_LIST: string[] = []

export const normalRoutes: AppRouteRecordRaw[] = [
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录页面',
    },
  },
]
