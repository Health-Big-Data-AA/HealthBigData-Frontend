import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'      // 1. 引入 Element Plus
import 'element-plus/dist/index.css'     // 2. 引入 Element Plus 的样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // 3. 引入所有 Element Plus 图标

import App from './App.vue'
import router from './router'

const app = createApp(App)

// 4. 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus) // 5. 全局注册 Element Plus

app.mount('#app')
