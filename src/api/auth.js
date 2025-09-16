import request from '@/utils/request';

// 登录方法
export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data: data
  });
}

// 获取登录验证码
export function getLoginCode(data) {
  return request({
    url: '/api/auth/request-login-code',
    method: 'post',
    data: data
  })
}
