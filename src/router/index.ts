import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus' // 确保 ElMessage 被导入

import LoginView from '../views/LoginView.vue'
import MainLayout from '../layouts/MainLayout.vue'
import HomeView from '../views/HomeView.vue'
import UserManagementView from '../views/UserManagementView.vue'
import AboutView from '../views/AboutView.vue'

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
