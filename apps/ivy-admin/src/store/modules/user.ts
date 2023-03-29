import { http } from '@/utils/http'
import { defineStore } from 'pinia'

interface UserInfo {
  companyId: string
  companyName: string
  departId: string
  departName: string
  id: string
  userName: string
  loginName: string
  userStatus: string
  userMobile: string
  updateUser: string
  updateTime: string
  [x: string]: string | number
}

interface UserStoreStruct {
  userInfo: UserInfo
  token: string
  defaultRoute: string
}

export const useUserStore = defineStore('user', {
  state: (): UserStoreStruct => ({
    userInfo: {} as UserInfo,
    token: '',
    defaultRoute: '/overview',
  }),
  getters: {},
  actions: {
    loginByUser(data: Recordable): Promise<boolean> {
      return new Promise((resolve, reject) => {
        // login<
        //   Recordable,
        //   {
        //     result: {
        //       token: string
        //     }
        //   }
        // >(data)
        //   .then(res => {
        //     store2.set(SYS_CONSTANT.AUTH_TOKEN, res.headers['authorization'])
        //     resolve(true)
        //   })
        //   .catch(err => {
        //     console.error(err)
        //     reject(false)
        //   })
      })
    },

    // 获取用户信息
    async getUserInfo() {
      const res = await http.get<UserInfo>(
        {
          url: `api/users/current-user`,
        },
        {
          joinPrefix: true,
          urlPrefix: `${window.config.uaa_url}`,
        }
      )
      this.userInfo = res
    },

    loginOutByUser() {
      // loginOut().then(() => {
      //   store2.clearAll()
      //   router.push('/login')
      // })
    },
  },
})
