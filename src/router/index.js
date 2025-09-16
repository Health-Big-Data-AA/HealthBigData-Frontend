import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

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
        { path: 'data', name: 'data', component: DataManagementView, meta: { requiresAuth: true, title: '数据管理' } },
        { path: 'statistics', name: 'statistics', component: StatisticsView, meta: { requiresAuth: true, title: '统计分析' } },
        { path: 'logs', name: 'logs', component: LogAuditView, meta: { requiresAuth: true, title: '日志审计' } },
        { path: 'about', name: 'about', component: AboutView, meta: { requiresAuth: true } },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const hasToken = userStore.token

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    if (to.meta.requiresAuth) {
      next('/login')
    } else {
      next()
    }
  }
});

export default router
