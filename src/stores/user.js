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
      // --- 新增: 从本地存储读取头像链接 ---
      avatarUrl: getStorage('user-avatar') || '',
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
          // --- 新增: 从登录响应中获取并存储头像链接 ---
          this.avatarUrl = data.avatarUrl

          setStorage('user-token', data.token)
          setStorage('user-name', data.userName)
          setStorage('user-roles', JSON.stringify(data.roles))
          // --- 新增: 将头像链接存入本地存储 ---
          setStorage('user-avatar', data.avatarUrl)

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
        // --- 新增: 登出时清除头像链接 ---
        this.avatarUrl = ''
        delStorage('user-token')
        delStorage('user-name')
        delStorage('user-roles')
        // --- 新增: 从本地存储中删除头像链接 ---
        delStorage('user-avatar')

        router.push('/');
        resolve()
      })
    },

    // --- 新增: 一个专门用来更新头像的 action ---
    setAvatar(avatarUrl) {
      this.avatarUrl = avatarUrl;
      setStorage('user-avatar', avatarUrl);
    },

    hasPermission(requiredRoles) {
      if (this.roles && this.roles.length > 0 && requiredRoles && requiredRoles.length > 0) {
        return this.roles.some(role => requiredRoles.includes(role))
      }
      return false
    }
  }
})
