import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // 新增 server 配置
    proxy: {
      // 定义一个代理规则，所有以 /api 开头的请求都会被代理
      '/api': {
        // 代理的目标服务器地址
        target: 'http://localhost:8080',
        // 是否改变请求源头，true 表示会将请求头中的 host 设置为目标服务器的 host
        changeOrigin: true,
        // 如果后端 API 的路径本身不包含 /api，可以用下面的 rewrite 配置去掉它
        // 但根据您的后端代码，路径是包含 /api 的，所以这里不需要 rewrite
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
