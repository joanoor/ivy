import { http } from '@/plugins/request'
import { defineStore } from 'pinia'
import store from 'store2'
import { SYS_CONSTANT } from '@/libs/shared/constant'

export interface LoginForm {
  loginName: string
  password: string
}

interface Token {
  token: string
}

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

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {} as UserInfo,
  }),
  getters: {},
  actions: {
    loginByUser(data: Recordable): Promise<boolean> {
      return new Promise((resolve, reject) => {
        http
          .get<Token>({
            url: `api/login`,
            data,
          })
          .then(res => {
            store.set(
              SYS_CONSTANT.AUTH_TOKEN,
              'bd593d99e47f4943adbeabb9b8ccc9f1'
            )
            resolve(true)
          })
          .catch(err => {
            console.error(err)
            reject(false)
          })
      })
    },
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
  },
})
