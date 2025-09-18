import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import permissionDirective from './directives/permission'

import App from './App.vue'
import router from './router' // <--- 修改这里，去掉文件名和后缀
import './assets/main.css' // 引入基础样式
import './styles/index.scss' // 全局引入 SCSS 样式

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.directive('permission', permissionDirective)
app.mount('#app')
