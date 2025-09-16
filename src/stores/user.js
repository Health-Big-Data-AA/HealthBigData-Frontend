import { defineStore } from 'pinia'
import { login } from '@/api/auth'
import { getStorage, setStorage, delStorage } from '@/utils/localStorage'
import router from '@/router'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getStorage('user-token') || '',
    name: getStorage('user-name') || '',
    roles: getStorage('user-roles') || [],
  }),
  actions: {
    // 登录
    login(userInfo) {
      const { username, password, verificationCode } = userInfo
      return new Promise((resolve, reject) => {
        login({ userName: username.trim(), password: password, verificationCode: verificationCode }).then(res => {
          const { data } = res
          // 存储 Token 和用户信息
          this.token = data.token
          this.name = data.userName
          this.roles = data.roles
          setStorage('user-token', data.token)
          setStorage('user-name', data.userName)
          setStorage('user-roles', data.roles)
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
        this.name = ''
        delStorage('user-token')
        delStorage('user-name')
        delStorage('user-roles')
        router.push('/login');
        resolve()
      })
    },

    // **【新增】** 判断用户是否拥有特定权限
    hasPermission(requiredRole) {
      if (requiredRole && requiredRole.length > 0) {
        // 检查用户的角色数组中是否包含所需的角色
        // 假设 roles 数组中存储的是角色代码，如 ['ADMIN', 'RESEARCHER']
        return this.roles.includes(requiredRole);
      }
      return true; // 如果没有指定权限要求，则默认允许访问
    }
  }
})
