import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus' // 确保 ElMessage 被导入

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
    // 1. 登录页，无布局
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    // 2. 主应用，有MainLayout布局
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '', // 默认子路由
          name: 'home',
          component: HomeView,
          meta: { requiresAuth: true }
        },
        {
          path: 'users',
          name: 'users',
          component: UserManagementView,
          meta: { requiresAuth: true }
        },

        {
          path: 'statistics', // 访问路径 /statistics
          name: 'statistics',
          component: StatisticsView,
          meta: { requiresAuth: true, title: '统计分析' }
        },

        {
          path: 'data', // 定义 URL 路径 /data
          name: 'data', // 定义路由名称
          component: DataManagementView, // 关联组件
          meta: { requiresAuth: true, title: '数据管理' } // 同样需要登录验证，并添加页面标题
        },

        // 2. 在这里添加新路由
        {
          path: 'logs', // 访问路径 /logs
          name: 'logs',
          component: LogAuditView,
          meta: { requiresAuth: true, title: '日志审计' }
        },

        {
          path: 'about',
          name: 'about',
          component: AboutView,
          meta: { requiresAuth: true }
        },
      ],
    },
    // 3. 【已删除】这里删除了重复的、导致冲突的重定向规则
  ],
})

// 路由守卫 (这个逻辑是正确的，无需改动)
router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    return next();
  }

  const loggedIn = !!localStorage.getItem('user-token');
  if (!loggedIn && to.meta.requiresAuth) {
    ElMessage.warning('请先登录');
    return next({ name: 'login' });
  }

  next();
});

export default router
