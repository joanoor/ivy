export interface Menu {
  menuId: string
  icon: string
  menuName: string
  children: Menu[]
}

export const menuList: Menu[] = [
  {
    menuId: 'dashboard',
    icon: 'user_overview',
    menuName: '用户概览',
    children: [],
  },
  {
    menuId: 'device',
    icon: 'device_manager',
    menuName: '设备管理',
    children: [],
  },
  {
    menuId: 'chart',
    icon: 'device_manager',
    menuName: 'chart',
    children: [],
  },
  {
    menuId: 'analysis',
    icon: 'energy_analysis',
    menuName: '杂项',
    children: [
      {
        menuId: 'home',
        icon: '',
        menuName: '用能分析',
        children: [],
      },
      {
        menuId: 'canvas',
        icon: '',
        menuName: '画布',
        children: [],
      },
    ],
  },

  {
    menuId: 'app_system_manager',
    icon: 'system_manager',
    menuName: '系统管理',
    children: [
      {
        menuId: 'organizations',
        icon: '',
        menuName: '组织管理',
        children: [],
      },
      {
        menuId: 'regions',
        icon: '',
        menuName: '企业管理',
        children: [],
      },
      // {
      //   menuId: 'users',
      //   icon:'',
      //   menuName: '用户管理',
      //   children: []
      // },
      // {
      //   menuId: 'roles',
      //   icon:'',
      //   menuName: '角色管理',
      //   children: []
      // },
      {
        menuId: 'fields',
        icon: '',
        menuName: '字段管理',
        children: [],
      },
    ],
  },
]
