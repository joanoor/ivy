// import { http } from '@/plugins/request'
// import { defineStore } from 'pinia'
// import { baseRoutes } from '@/router/routes/routes'
// import { dm } from '@/libs/utils/dm'
// import { AppRouteRecordRaw } from '@/router/types'
// import { RouteMeta, RouteRecordRaw } from 'vue-router'
// import { resetRouter, router } from '@/router'

// export interface ResourceRoute {
//   createTime: string
//   createUser: string
//   iconClass: string
//   id: string
//   parentCode: string
//   parentName: string
//   parentType: string
//   pid: string
//   projectCode: string
//   resourceCode: string
//   resourceName: string
//   resourcePath: string
//   resourceType: 'page' | 'menu' | 'product'
//   routeHidden: 0 | 1 // 0 表示显示 1 表示隐藏
//   routePath: string
//   updateTime: string
//   updateUser: string
//   children: ResourceRoute[]
//   [x: string]: string | number | ResourceRoute | ResourceRoute[]
// }

// /**
//  * 生成登录进入项目的默认导航路由
//  * @param route
//  * @param prefix
//  * @returns
//  */
// const generateDefaultRoute = (route: ResourceRoute, prefix = '/'): string => {
//   if (route.children) {
//     return generateDefaultRoute(
//       route.children[0],
//       prefix + route.resourceCode + '/'
//     )
//   } else {
//     return prefix + route.resourceCode
//   }
// }

// /**
//  * 生成项目的默认路由
//  * @param routes
//  * @returns
//  */
// const generateRoutes = (routes: ResourceRoute[]) => {
//   const result: AppRouteRecordRaw[] = []
//   for (const route of routes) {
//     result.push(...expandRoutePath(route))
//   }
//   return result
// }

// const expandRoutePath = (route: ResourceRoute, path = '', parentName = '') => {
//   const routes: AppRouteRecordRaw[] = []
//   if (route.children) {
//     for (const li of route.children) {
//       routes.push(
//         ...expandRoutePath(
//           li,
//           path + route.resourceCode + '/',
//           route.resourceType === 'page'
//             ? baseRoutes.find(v => v.name === route.resourceCode)?.name
//             : ''
//         )
//       )
//     }
//   }

//   if (route.resourceType === 'page') {
//     const tmpRoute = baseRoutes.find(v => v.name === route.resourceCode)
//     routes.push({
//       meta: (route.meta ?? {}) as unknown as RouteMeta,
//       name: (parentName ? parentName + '-' : '') + tmpRoute?.name ?? '',
//       component: tmpRoute?.component,
//       path: path + route.resourceCode,
//     })
//   }

//   return routes
// }

// /**
//  * 过滤接口返回路由，生成项目路由及默认导航路由
//  * @param data
//  */
// const filterAsyncRouter = (data: ResourceRoute[] = []) => {
//   const menuList = data.reduce((acc, cur) => {
//     if (
//       (baseRoutes.some(v => v.name === cur.resourceCode) &&
//         cur.routeHidden === 0) ||
//       ['page', 'product'].indexOf(cur.resourceType) === -1
//     ) {
//       acc.push(cur)
//     }
//     return acc
//   }, [] as ResourceRoute[])
//   const menuTree = dm.changeToTree(menuList)

//   console.log(`menuTree`, menuTree)

//   // 生成登录进入项目的默认导航路由
//   const defaultRoute = generateDefaultRoute(menuTree[0])

//   // 生成项目的最终路由
//   const ultimateRoutes = generateRoutes(menuTree)
//   console.log(`ultimateRoutes`, ultimateRoutes)

//   return {
//     menuTree,
//     defaultRoute,
//     routes: ultimateRoutes as unknown as RouteRecordRaw[],
//   }
// }

// /**
//  * 根据不同的登录用户，动态生成不同的路由
//  */
// export const usePermissionStore = defineStore('permission', {
//   state: () => ({
//     ultimateRoutes: [] as RouteRecordRaw[],
//     menuList: [] as ResourceRoute[],
//     defaultRouter: '/',
//   }),
//   getters: {},
//   actions: {
//     async getRoutes() {
//       const res = await http.get<ResourceRoute[]>(
//         {
//           url: `/api/resources/current-user`,
//           params: {
//             projectCode: `offender-assessment,system`,
//             resourceType: `product,page,menu`,
//           },
//         },
//         {
//           joinPrefix: true,
//           urlPrefix: `${window.config.uaa_url}`,
//         }
//       )
//       const {
//         menuTree: menuList,
//         routes,
//         defaultRoute,
//       } = filterAsyncRouter(res)

//       // 保存项目菜单
//       this.setMenuList(menuList)

//       // 保存默认的导航路由
//       this.setDefaultRoute(defaultRoute)

//       // 设置最终的项目路由结果
//       const ultimateRoutes: RouteRecordRaw[] = [
//         {
//           component: () => import('@/layout/default.vue'),
//           path: '/',
//           children: [...routes],
//           name: 'Home',
//         },
//       ]

//       // 保存最终的路由结果
//       this.setUltimateRoutes(ultimateRoutes)

//       // 动态添加路由
//       ultimateRoutes.forEach(route => {
//         router.addRoute(route)
//       })
//     },
//     setMenuList(menus: ResourceRoute[]) {
//       this.menuList = menus
//     },
//     setDefaultRoute(defaultRoute: string) {
//       this.defaultRouter = defaultRoute
//     },
//     setUltimateRoutes(routes: RouteRecordRaw[]) {
//       this.ultimateRoutes = routes
//     },
//   },
// })

export {}
