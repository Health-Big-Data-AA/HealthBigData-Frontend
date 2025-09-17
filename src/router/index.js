// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import LoginView from '../views/LoginView.vue'
import UserManagementView from '../views/UserManagementView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 1. 登录页，无布局
    {
      path: '/login', // 假设你的登录页路由
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    // 2. 主应用，有MainLayout布局
    {
      path: '/',
      component: MainLayout,
      redirect: '/home',
      children: [
        {
          path: 'home', // 默认子路由
          name: 'home',
          component: () => import('@/views/HomeView.vue')
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('@/views/UserManagementView.vue')
        },


      ]
    },
  ]
})

// *** 添加全局前置守卫 ***
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('user-token');

  // 如果目标路由不是登录页，并且用户未认证，则重定向到登录页
  if (to.name !== 'login' && !isAuthenticated) {
    next({ name: 'login' });
  }
  // 如果用户已认证，并且尝试访问登录页，则重定向到首页
  else if (isAuthenticated && to.name === 'login') {
    next({ name: 'home' });
  }
  // 其他情况，正常放行
  else {
    next();
  }
});

export default router