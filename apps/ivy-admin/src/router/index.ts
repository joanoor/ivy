import type { App } from 'vue'
import type { AppRouteRecordRaw } from './types'
import { createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { createRouter } from 'vue-router'
import { normalRoutes, WHITE_NAME_LIST } from './routes'

export const routes: AppRouteRecordRaw[] = [
  ...normalRoutes,
  {
    component: () => import('@/layout/default.vue'),
    path: '/',
    redirect: '/application',
    children: [
      {
        name: 'application',
        path: '/application/:page*',
        component: () => import('@/views/application/index.vue'),
        meta: {
          title: '应用管理',
          icon: 'example',
          breadList: [{ name: '应用管理' }],
        },
      },
      {
        name: 'appdetail',
        path: '/application/appdetail',
        component: () => import('@/views/application/appDetail.vue'),
        meta: {
          title: '应用详情设置',
          icon: 'example',
          breadList: [{ name: '应用详情设置' }],
          activeMenu: 'application',
        },
      },
      {
        name: 'organization',
        path: '/organization/:page*',
        component: () => import('@/views/organization/index.vue'),
        meta: {
          title: '组织机构',
          icon: 'example',
          breadList: [{ name: '应用管理' }],
        },
      },

      {
        name: 'role',
        path: '/role/:page*',
        component: () => import('@/views/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'example',
          breadList: [{ name: '角色管理' }],
        },
      },
      {
        name: 'log',
        path: '/log/:page*',
        component: () => import('@/views/log/index.vue'),
        meta: {
          title: '日志管理',
          icon: 'example',
          breadList: [{ name: '日志管理' }],
        },
      },
      {
        name: 'fields',
        path: '/fields/:page*',
        component: () => import('@/views/fields/index.vue'),
        meta: {
          title: '字段管理',
          icon: 'example',
          breadList: [{ name: '字段管理' }],
        },
      },
      {
        name: 'personal',
        path: '/personal/:page*',
        component: () => import('@/views/personal/index.vue'),
        meta: {
          title: '个人设置',
          icon: 'example',
          breadList: [{ name: '个人设置' }],
        },
      },
      // {
      //   name: 'chargeRecord',
      //   path: '/jdmanager/chargerecord',
      //   component: () => import('@/views/jdmanager/chargeRecord.vue'),
      //   meta: {
      //     title: '充电记录管理',
      //     icon: 'example',
      //     breadList: [{ name: '检定管理' }, { name: '充电记录管理' }],
      //   },
      // },
      // {
      //   name: 'loadTask',
      //   path: '/jdmanager/loadtask',
      //   component: () => import('@/views/jdmanager/loadTask.vue'),
      //   meta: {
      //     title: '复核任务管理',
      //     icon: 'example',
      //     breadList: [{ name: '检定管理' }, { name: '复核任务管理' }],
      //   },
      // },
      // {
      //   name: 'preview',
      //   path: '/jdmanager/preview',
      //   component: () => import('@/views/jdmanager/preview.vue'),
      //   meta: {
      //     title: '预览文件',
      //     icon: 'example',
      //     breadList: [{ name: '检定管理' }, { name: '复核任务管理' }, { name: '预览文件' }],
      //   },
      // },
      // {
      //   name: 'station',
      //   path: '/running/station',
      //   component: () => import('@/views/running/station.vue'),
      //   meta: {
      //     title: '充电站运行监测',
      //     icon: 'example',
      //     breadList: [{ name: '运行监测' }, { name: '充电站运行监测' }],
      //   },
      // },
      // {
      //   name: 'meterEquip',
      //   path: '/running/meterequip',
      //   component: () => import('@/views/running/meterEquip.vue'),
      //   meta: {
      //     title: '计量设备运行监测',
      //     icon: 'example',
      //     breadList: [{ name: '运行监测' }, { name: '计量设备运行监测' }],
      //   },
      // },
      // {
      //   name: 'bindingDevice',
      //   path: '/running/bindingdevice',
      //   component: () => import('@/views/running/bindingDevice.vue'),
      //   meta: {
      //     title: '设备绑定',
      //     icon: 'example',
      //     breadList: [{ name: '运行监测' }, { name: '设备绑定' }],
      //   },
      // },
      // {
      //   name: 'modifyParam',
      //   path: '/cjmanager/modifyparam',
      //   component: () => import('@/views/cjmanager/modifyParam.vue'),
      //   meta: {
      //     title: '修改设备参数',
      //     icon: 'example',
      //     breadList: [{ name: '采集管理' }, { name: '修改设备参数' }],
      //   },
      // },
      // {
      //   name: 'archives',
      //   path: '/archives/home',
      //   component: () => import('@/views/archives/home.vue'),
      //   meta: {
      //     title: '档案概览',
      //     icon: 'example',
      //     breadList: [{ name: '档案管理' }, { name: '档案概览' }],
      //   },
      // },
      // {
      //   name: 'operator',
      //   path: '/archives/operator',
      //   component: () => import('@/views/archives/operator.vue'),
      //   meta: {
      //     title: '运营商管理',
      //     icon: 'example',
      //     breadList: [{ name: '档案管理' }, { name: '运营商管理' }],
      //   },
      // },
      // {
      //   name: 'supplier',
      //   path: '/archives/supplier',
      //   component: () => import('@/views/archives/supplier.vue'),
      //   meta: {
      //     title: '供应商管理',
      //     icon: 'example',
      //     breadList: [{ name: '档案管理' }, { name: '供应商管理' }],
      //   },
      // },
      // {
      //   name: 'chargingStation',
      //   path: '/archives/chargingstation',
      //   component: () => import('@/views/archives/chargingStation.vue'),
      //   meta: {
      //     title: '充电站管理',
      //     icon: 'example',
      //     breadList: [{ name: '档案管理' }, { name: '充电站管理' }],
      //   },
      // },
      // {
      //   name: 'chargingPile',
      //   path: '/archives/chargingpile',
      //   component: () => import('@/views/archives/chargingPile.vue'),
      //   meta: {
      //     title: '充电桩管理',
      //     icon: 'example',
      //     breadList: [{ name: '档案管理' }, { name: '充电桩管理' }],
      //   },
      // },
      // {
      //   name: 'chargingMeterage',
      //   path: '/archives/chargingMeterage',
      //   component: () => import('@/views/archives/chargingMeterage.vue'),
      //   meta: {
      //     title: '计量设备管理',
      //     icon: 'example',
      //     breadList: [{ name: '档案管理' }, { name: '计量设备管理' }],
      //   },
      // },
      // {
      //   name: 'fields',
      //   path: '/system/fields',
      //   component: () => import('@/views/system/fields.vue'),
      //   meta: {
      //     title: '字段管理',
      //     icon: 'example',
      //     breadList: [{ name: '系统管理' }, { name: '字段管理' }],
      //   },
      // },
    ],
  },
]

export const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes: routes as unknown as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export function resetRouter() {
  router.getRoutes().forEach(route => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export function setupRouter(app: App<Element>) {
  app.use(router)
}
