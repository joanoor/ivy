import { defineStore } from 'pinia'
import store from 'store2'
import { SYS_CONSTANT, } from '@/libs/shared/constant'
import { handleLogin, ResponseLogin } from '@/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {} as ResponseLogin,

  }),
  getters: {},
  actions: {
    loginByUser<T>(data: T): Promise<boolean> {
      return new Promise((resolve, reject) => {
        handleLogin<T>(data).then(res => {
          this.userInfo = res
          store.set(SYS_CONSTANT.AUTH_TOKEN, res.token)
          resolve(true)
        }).catch(err => {
          console.error(err)
          reject(false)
        })
      })
    },
  },
})
