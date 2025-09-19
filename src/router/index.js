// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Import all your views
import LandingView from '../views/LandingView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import UserManagementView from '../views/UserManagementView.vue'
import RoleManagementView from '../views/RoleManagementView.vue'
import DataManagementView from '../views/DataManagementView.vue'
// [新增] 导入新创建的权限管理视图
import PermissionManagementView from '../views/PermissionManagementView.vue'
import StatisticsView from '../views/StatisticsView.vue'
import LogAuditView from '../views/LogAuditView.vue'
import AccountView from '../views/AccountView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public routes
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },

    // Authenticated routes
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true, title: '仪表盘' }
    },
    {
      path: '/users',
      name: 'users',
      component: UserManagementView,
      meta: { requiresAuth: true, title: '用户管理', roles: ['ADMIN'] }
    },
    {
      path: '/roles',
      name: 'roles',
      component: RoleManagementView,
      meta: { requiresAuth: true, title: '角色管理', roles: ['ADMIN'] }
    },
    // [新增] 添加权限管理页面的路由规则
    {
      path: '/permissions',
      name: 'permissions',
      component: PermissionManagementView,
      meta: { requiresAuth: true, title: '权限管理', roles: ['ADMIN'] }
    },
    {
      path: '/data',
      name: 'data',
      component: DataManagementView,
      meta: { requiresAuth: true, title: '数据管理' }
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: StatisticsView,
      meta: { requiresAuth: true, title: '统计分析' }
    },
    {
      path: '/logs',
      name: 'logs',
      component: LogAuditView,
      meta: { requiresAuth: true, title: '日志审计' }
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
      meta: { requiresAuth: true, title: '账户中心' }
    }
  ],
})

export default router
