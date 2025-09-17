import axios from 'axios';
import { ElMessage } from 'element-plus';

// 创建 axios 实例
const service = axios.create({
    // 后端 API 的基础 URL
    baseURL: 'http://localhost:8080/', // 注意：后端端口是80，这里我们省略了
    timeout: 5000 // 请求超时时间
});

// 请求拦截器 (可选)
service.interceptors.request.use(
    config => {
        // 可以在这里添加 token 等请求头
        // const token = localStorage.getItem('user-token');
        // if (token) {
        //   config.headers['Authorization'] = token;
        // }
        return config;
    },
    error => {
        console.log(error); // for debug
        return Promise.reject(error);
    }
);

// 响应拦截器 (可选)
service.interceptors.response.use(
    response => {
        // 直接返回响应的 data 部分
        return response.data;
    },
    error => {
        console.error('API Error: ', error);
        ElMessage({
            message: error.message || '请求失败，请检查网络或联系管理员',
            type: 'error',
            duration: 5 * 1000
        });
        return Promise.reject(error);
    }
);

export default service;