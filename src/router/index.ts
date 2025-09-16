import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user' // 引入 user store

import LoginView from '../views/LoginView.vue'
import MainLayout from '../layouts/MainLayout.vue'
import HomeView from '../views/HomeView.vue'
import UserManagementView from '../views/UserManagementView.vue'
import AboutView from '../views/AboutView.vue'
import DataManagementView from '../views/DataManagementView.vue'
import StatisticsView from '../views/StatisticsView.vue';
import LogAuditView from '../views/LogAuditView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', name: 'home', component: HomeView, meta: { requiresAuth: true } },
        { path: 'users', name: 'users', component: UserManagementView, meta: { requiresAuth: true } },
        { path: 'statistics', name: 'statistics', component: StatisticsView, meta: { requiresAuth: true, title: '统计分析' } },
        { path: 'data', name: 'data', component: DataManagementView, meta: { requiresAuth: true, title: '数据管理' } },
        { path: 'logs', name: 'logs', component: LogAuditView, meta: { requiresAuth: true, title: '日志审计' } },
        { path: 'about', name: 'about', component: AboutView, meta: { requiresAuth: true } },
      ],
    },
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const hasToken = userStore.token

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，访问登录页则重定向到主页
      next({ path: '/' })
    } else {
      // 这里可以添加获取用户角色的逻辑
      next()
    }
  } else {
    // 没有token
    if (to.meta.requiresAuth) {
      // 如果访问的是需要权限的页面，则重定向到登录页
      next(`/login?redirect=${to.path}`)
    } else {
      // 否则直接放行
      next()
    }
  }
});

export default router
