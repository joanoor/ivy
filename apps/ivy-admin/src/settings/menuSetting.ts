export interface Menu {
  menuId: string
  icon: string
  menuName: string
  children: Menu[]
}

export const menuList: Menu[] = [
  {
    menuId: 'application',
    icon: 'application',
    menuName: '应用管理',
    children: [],
  },
  {
    menuId: 'organization',
    icon: 'organization',
    menuName: '组织结构',
    children: [
      // {
      //   menuId: 'chargerecord',
      //   icon: '',
      //   menuName: '充电记录管理',
      //   children: [],
      // },
      // {
      //   menuId: 'loadtask',
      //   icon: '',
      //   menuName: '复核任务管理',
      //   children: [],
      // },
    ],
  },
  {
    menuId: 'role',
    icon: 'role',
    menuName: '角色管理',
    children: [
      {
        menuId: 'station',
        icon: '',
        menuName: '充电站运行监测',
        children: [],
      },
      {
        menuId: 'meterequip',
        icon: '',
        menuName: '计量设备运行监测',
        children: [],
      },
      {
        menuId: 'bindingdevice',
        icon: '',
        menuName: '设备绑定',
        children: [],
      },
    ],
  },
  {
    menuId: 'log',
    icon: 'log',
    menuName: '日志管理',
    children: [
      // {
      //   menuId: 'modifyparam',
      //   icon: '',
      //   menuName: '修改设备参数',
      //   children: [],
      // },
    ],
  },
  {
    menuId: 'fields',
    icon: 'field',
    menuName: '字段管理',
    children: [
      // {
      //   menuId: 'home',
      //   icon: '',
      //   menuName: '档案概览',
      //   children: [],
      // },
      // {
      //   menuId: 'operator',
      //   icon: '',
      //   menuName: '运营商管理',
      //   children: [],
      // },
      // {
      //   menuId: 'supplier',
      //   icon: '',
      //   menuName: '供应商管理',
      //   children: [],
      // },
      // {
      //   menuId: 'chargingstation',
      //   icon: '',
      //   menuName: '充电站管理',
      //   children: [],
      // },
      // {
      //   menuId: 'chargingpile',
      //   icon: '',
      //   menuName: '充电桩管理',
      //   children: [],
      // },
      // {
      //   menuId: 'chargingMeterage',
      //   icon: '',
      //   menuName: '计量设备管理',
      //   children: [],
      // },
    ],
  },
  {
    menuId: 'personal',
    icon: 'personal',
    menuName: '个人设置',
    children: [
      // {
      //   menuId: 'fields',
      //   icon: '',
      //   menuName: '字段管理',
      //   children: [],
      // },
    ],
  },
]
