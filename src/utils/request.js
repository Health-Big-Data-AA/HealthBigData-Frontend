import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const URL = "http://localhost:8080"
// create an axios instance
const service = axios.create({
  baseURL: URL, // url = base url + request url
  timeout: 10000, // request timeout
})

// http request 拦截器
service.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    if (userStore.token) {
      // 让每个请求携带自定义 token
      config.headers['Authorization'] = 'Bearer ' + userStore.token
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// http response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // code为200，一切正常
    if (res.code === 200) {
      return res
    } else {
      ElMessage({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.msg || 'Error'))
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
