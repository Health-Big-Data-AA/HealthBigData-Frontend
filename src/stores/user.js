// src/stores/user.js
import { defineStore } from 'pinia'

// 存储用户的登录状态和权限信息
export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('user-token') || '',
    name: '',
    roles: [],
    permissions: [] // 关键：存储用户权限代码的数组
  }),
  actions: {
    // 模拟登录成功后，设置用户信息
    // 在实际项目中，你应该在登录接口成功后调用此方法
    setUserInfo(userData) {
      // 模拟后端返回的数据结构
      const mockBackendResponse = {
        admin: {
          name: '管理员',
          roles: ['ADMIN'],
          permissions: ['data:view', 'data:import', 'data:export', 'data:clean', 'user:manage', 'log:audit']
        },
        researcher: {
          name: '研究员',
          roles: ['RESEARCHER'],
          permissions: ['data:view', 'data:import', 'data:clean']
        },
        analyst: {
          name: '分析师',
          roles: ['ANALYST'],
          permissions: ['data:view', 'data:export']
        },
        auditor: {
          name: '审核员',
          roles: ['AUDITOR'],
          permissions: ['log:audit']
        }
      };

      const info = mockBackendResponse[userData.username] || { name: '未知用户', roles: [], permissions: [] };

      this.name = info.name;
      this.roles = info.roles;
      this.permissions = info.permissions;
      this.token = userData.token; // 保存 token
      localStorage.setItem('user-token', userData.token);
    },

    // 退出登录
    logout() {
      this.token = '';
      this.name = '';
      this.roles = [];
      this.permissions = [];
      localStorage.removeItem('user-token');
      // 可以选择性地跳转到登录页
      // router.push('/login');
    },

    // 判断是否有某个权限
    hasPermission(permission) {
      // 管理员拥有所有权限
      if (this.roles.includes('ADMIN')) {
        return true;
      }
      return this.permissions.includes(permission);
    }
  }
})
