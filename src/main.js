import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import permissionDirective from './directives/permission'

import App from './App.vue'
import router from './router'
import './assets/main.css'
import './styles/index.scss'

// 【新增】导入 ElMessage 和 useUserStore
import { ElMessage } from 'element-plus'
import { useUserStore } from './stores/user'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 确保 Pinia 在 Router 之前被 use
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.directive('permission', permissionDirective)

// --- 【新增】将路由守卫逻辑放在这里 ---
router.beforeEach((to, from, next) => {
  // 在这里调用 useUserStore() 是安全的，因为 Pinia 已经被 app.use()
  const userStore = useUserStore()

  // 公开页面，直接放行
  if (to.name === 'landing' || to.name === 'login') {
    return next();
  }

  // 检查是否已登录 (Token是否存在)
  const loggedIn = !!userStore.token; // 从 store 直接读取 token
  if (!loggedIn && to.meta.requiresAuth) {
    ElMessage.warning('请先登录');
    return next({ name: 'login' });
  }

  // 角色权限检查逻辑
  if (to.meta.roles && to.meta.roles.length > 0) {
    // 使用 store 中已经定义好的 hasPermission 方法
    const hasRequiredRole = to.meta.roles.some(role => userStore.roles.includes(role));

    if (hasRequiredRole) {
      next(); // 有权限，放行
    } else {
      ElMessage.error('您没有权限访问此页面');
      // 如果来源页存在且不是登录页，则停留在来源页，否则跳转到仪表盘
      if (from.path && from.name !== 'login') {
        next(from.path);
      } else {
        next('/app/dashboard');
      }
    }
  } else {
    // 路由不需要特定角色，直接放行
    next();
  }
});

app.mount('#app')
