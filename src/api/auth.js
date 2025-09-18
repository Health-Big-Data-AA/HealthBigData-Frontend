import request from '../utils/request';

// 登录方法
export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  });
}

// 【新增】请求注册验证码
export function getRegisterCode(data) {
  return request({
    url: '/api/auth/request-register-code',
    method: 'post',
    data
  });
}

// 【新增】注册方法
export function register(data) {
  return request({
    url: '/api/auth/register',
    method: 'post',
    data
  });
}

// 【新增】请求密码重置验证码
export function getPasswordResetCode(data) {
  return request({
    url: '/api/auth/request-password-reset-code',
    method: 'post',
    data
  });
}

// 【新增】重置密码
export function resetPassword(data) {
  return request({
    url: '/api/auth/reset-password',
    method: 'post',
    data: data
  });
}
