import { defineStore } from 'pinia'
import { login } from '@/api/auth'
import { getStorage, setStorage, delStorage } from '@/utils/localStorage'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getStorage('user-token') || '',
    name: '',
    roles: [],
    permissions: []
  }),
  actions: {
    // 登录
    login(userInfo) {
      const { username, password, verificationCode } = userInfo
      return new Promise((resolve, reject) => {
        login({ userName: username.trim(), password: password, verificationCode: verificationCode }).then(res => {
          const { data } = res
          this.token = data.token
          setStorage('user-token', data.token)
          // 可以在这里同时保存 roles 和 name
          this.name = data.userName
          this.roles = data.roles
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    logout() {
      return new Promise((resolve) => {
        this.token = ''
        this.roles = []
        this.permissions = []
        delStorage('user-token')
        resolve()
      })
    }
  }
})
