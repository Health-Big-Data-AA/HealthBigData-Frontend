import { createRouter, createWebHistory } from 'vue-router'

// Import new LandingView
import LandingView from '../views/LandingView.vue'
import LoginView from '../views/LoginView.vue'
import MainLayout from '../layouts/MainLayout.vue'
import Dashboard from '../views/DashboardView.vue'
import UserManagementView from '../views/UserManagementView.vue'
import RoleManagementView from '../views/RoleManagementView.vue'
import DataManagementView from '../views/DataManagementView.vue'
// import TagManagementView from '../views/TagManagementView.vue';
// import AboutView from '../views/AboutView.vue'
// import StatisticsView from '../views/StatisticsView.vue';
// import LogAuditView from '../views/LogAuditView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 1. New Landing Page at root
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
    // 2. Login page, no layout
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    // 3. Main application after login
    {
      path: '/app', // Changed base path for main app
      component: MainLayout,
      redirect: '/app/dashboard', // Redirect to dashboard by default
      children: [
        {
          path: 'dashboard', // Changed path to /app/dashboard
          name: 'dashboard',
          component: Dashboard,
          meta: { requiresAuth: true, title: '仪表盘' }
        },
        {
          path: 'users',
          name: 'users',
          component: UserManagementView,
          meta: { requiresAuth: true, title: '用户管理',roles: ['ADMIN'] }
        },
        {
          path: 'roles',
          name: 'roles',
          component: RoleManagementView,
          meta: { requiresAuth: true, title: '角色管理',roles: ['ADMIN'] }
        },
        {
          path: 'data',
          name: 'data',
          component: DataManagementView,
          meta: { requiresAuth: true, title: '数据管理', }
        },
        // {
        //   path: 'tags',
        //   name: 'tags',
        //   component: TagManagementView,
        //   meta: { requiresAuth: true, title: '标签管理' }
        // },
        // {
        //   path: 'statistics',
        //   name: 'statistics',
        //   component: StatisticsView,
        //   meta: { requiresAuth: true, title: '统计分析' }
        // },
        // {
        //   path: 'logs',
        //   name: 'logs',
        //   component: LogAuditView,
        //   meta: { requiresAuth: true, title: '日志审计' }
        // },
        // {
        //   path: 'about',
        //   name: 'about',
        //   component: AboutView,
        //   meta: { requiresAuth: true, title: '关于' }
        // },
      ],
    },
  ],
})


export default router
