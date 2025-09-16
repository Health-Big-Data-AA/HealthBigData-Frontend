import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

// 后端 API 的基础地址
const baseURL = "http://localhost:8080"

// 创建 axios 实例
const service = axios.create({
  baseURL: baseURL,
  timeout: 10000,
})

// Request 拦截器
service.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers['Authorization'] = 'Bearer ' + userStore.token
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// Response 拦截器
service.interceptors.response.use(
  response => {
    // 如果是文件流，直接返回
    if (response.request.responseType === 'blob') {
      return response;
    }
    const res = response.data
    // code 不是 200 的情况
    if (res.code !== 200) {
      ElMessage({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      // 401: Token 过期
      if (res.code === 401) {
        useUserStore().logout();
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error)
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
