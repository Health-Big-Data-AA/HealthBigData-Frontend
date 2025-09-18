// src/stores/user.js
import { defineStore } from 'pinia'
import { login } from '@/api/auth'
import { getStorage, setStorage, delStorage } from '@/utils/localStorage'
import router from '@/router'

export const useUserStore = defineStore('user', {
  state: () => {
    const rolesRaw = getStorage('user-roles');
    return {
      token: getStorage('user-token') || '',
      name: getStorage('user-name') || '',
      roles: rolesRaw ? JSON.parse(rolesRaw) : [],
    }
  },
  actions: {
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
          setStorage('user-roles', JSON.stringify(data.roles))

          // --- MODIFICATION HERE ---
          // Redirect to the landing page, which now acts as the main hub
          router.push({ path: '/' });
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    logout() {
      return new Promise((resolve) => {
        this.token = ''
        this.roles = []
        this.name = ''
        delStorage('user-token')
        delStorage('user-name')
        delStorage('user-roles')
        // On logout, always go to the public landing page
        router.push('/');
        resolve()
      })
    },

    hasPermission(requiredRoles) {
      if (this.roles && this.roles.length > 0 && requiredRoles && requiredRoles.length > 0) {
        return this.roles.some(role => requiredRoles.includes(role))
      }
      return false
    }
  }
})
