import { defineStore } from 'pinia'
import store from 'store2'
import { SYS_CONSTANT } from '@/libs/constant'
import { handleLogin, ResponseLogin } from '@/api'
import { useStorage } from '@vueuse/core'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {} as ResponseLogin,
  }),
  getters: {},
  actions: {
    loginByUser<T>(data: T): Promise<boolean> {
      return new Promise((resolve, reject) => {
        handleLogin<T>(data)
          .then(res => {
            useStorage(SYS_CONSTANT.AUTH_TOKEN, res.token)
            this.userInfo = res
            resolve(true)
          })
          .catch(err => {
            console.error(err)
            reject(false)
          })
      })
    },
  },
})
