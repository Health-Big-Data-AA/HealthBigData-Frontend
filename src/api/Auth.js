import request from '../utils/request.js';

/**
 * 用户注册接口
 */
export function register(data) {
    return request({
        url: '/api/auth/register', // 请求的 URL
        method: 'post',              // 请求方法
        data                   // 发送到后端的数据
    });
}
/**
 * 用户登录接口 (已更新)
 */
export function login(data) {
  return request({
    url: '/api/auth/login', // 请求的 URL
    method: 'post',              // 请求方法
    data                   // 发送到后端的数据
  })
}
/**
 * 【新增】请求登录验证码接口
 */
export function requestLoginCode(data) {
    return request({
        url: '/api/auth/request-login-code',
        method: 'post',
        data
    });
}



