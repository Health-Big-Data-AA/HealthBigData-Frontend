import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { getStorage } from './localStorage'

// 创建 axios 实例
const service = axios.create({
  // baseURL 将通过环境变量获取，/api 会被 vite.config.js 的代理拦截
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,
})

// Request 拦截器
service.interceptors.request.use(
  config => {
    // 此处直接从 localStorage 获取 token，避免 pinia 实例未挂载完成的问题
    const token = getStorage('user-token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
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
    // 如果响应是文件流（例如导出 Excel），则直接返回整个响应
    if (response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer') {
      return response;
    }

    // 从响应中解构出业务数据
    const res = response.data

    // 检查业务状态码，如果不为 200，则判定为错误
    if (res.code !== 200) {
      ElMessage({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 针对 Token 过期或无效的特定处理 (401)
      if (res.code === 401) {
        // 使用 ElMessageBox 提示用户
        ElMessageBox.confirm('您的登录已过期，请重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          // 调用 userStore 的 logout action，执行登出操作并跳转到登录页
          useUserStore().logout();
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      // 业务成功，直接返回后端API响应中的 data 字段或整个 res
      // 根据您的后端 CommonResult 结构，分页数据在 res.data 和 res.total 中
      // 因此我们返回整个 res 对象，方便在 API 调用处获取 total
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
