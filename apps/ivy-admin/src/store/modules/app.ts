import { defineStore } from 'pinia'
import { Menu, menuList } from '@/layout/components/LayoutSideBar/menuList'
import { DictType } from '@/libs/types'
import { queryDict } from '@/api'
import { DICT_FIELDS } from '@/libs/constant'

export const usePathStore = defineStore('breadcrumbs', {
  persist: true,
  state: () => ({
    breadcrumbList: [
      {
        menuId: 'app_user_overview',
        icon: 'user_overview',
        menuName: '用户概览',
        children: [],
      },
    ] as Menu[],
    systemDict: {} as DictType
  }),
  actions: {
    setBreadCrumb(path: string) {
      const pathArray = path
        .replace('#', '')
        .split('/')
        .filter(v => v)
      const firstLevelMenu = menuList.find(menu => menu.menuId === pathArray[0])
      let secondLevelMenu: Menu | undefined
      if (firstLevelMenu) {
        if (firstLevelMenu.children.length > 0) {
          secondLevelMenu = firstLevelMenu.children.find(
            cmenu => cmenu.menuId === pathArray[1]
          )
        }
      }

      this.breadcrumbList =
        firstLevelMenu && secondLevelMenu
          ? [firstLevelMenu, secondLevelMenu]
          : firstLevelMenu
            ? [firstLevelMenu]
            : []
    },

    async querySystemDict(data: typeof DICT_FIELDS) {
      const res = await queryDict(data)
      this.systemDict = res.result
    }
  },
})
