import { defineStore } from 'pinia'
import { login } from '@/api/auth'
import { getStorage, setStorage, delStorage } from '@/utils/localStorage'
import router from '@/router'

export const useUserStore = defineStore('user', {
  state: () => {
    // 【修改】从 localStorage 读取 roles 时，进行 JSON 解析
    const rolesRaw = getStorage('user-roles');
    return {
      token: getStorage('user-token') || '',
      name: getStorage('user-name') || '',
      // 如果 rolesRaw 存在，则解析它；否则返回空数组
      roles: rolesRaw ? JSON.parse(rolesRaw) : [],
    }
  },
  actions: {
    // 登录
    login(userInfo) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        login({ userName: username.trim(), password: password }).then(res => {
          const { data } = res
          this.token = data.token
          this.name = data.userName
          this.roles = data.roles

          setStorage('user-token', data.token)
          setStorage('user-name', data.userName)
          // 【修改】存入 localStorage 前，先将 roles 数组 JSON 序列化
          setStorage('user-roles', JSON.stringify(data.roles))

          router.push({ path: '/app/dashboard' });
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

    // 判断用户是否拥有特定角色 (这个方法现在可以正常工作了)
    hasPermission(requiredRoles) {
      if (this.roles && this.roles.length > 0 && requiredRoles && requiredRoles.length > 0) {
        return this.roles.some(role => requiredRoles.includes(role))
      }
      return false
    }
  }
})
