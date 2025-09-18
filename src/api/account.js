// src/api/account.js
import request from '../utils/request.js';

/**
 * 获取当前登录用户的信息
 */
export function getAccountInfo() {
  return request({
    url: '/api/users/me',
    method: 'get'
  });
}

/**
 * 更新当前登录用户的信息 (不包括密码)
 */
export function updateAccountInfo(data) {
  return request({
    url: '/api/users/me',
    method: 'put',
    data
  });
}

/**
 * 【新增】请求修改密码的验证码
 */
export function requestPasswordChangeCode() {
  return request({
    url: '/api/auth/request-password-change-code',
    method: 'post'
  });
}

/**
 * 【新增】确认修改密码
 */
export function changePassword(data) {
  return request({
    url: '/api/auth/change-password',
    method: 'post',
    data
  });
}

/**
 * 【新增】上传头像
 */
export function uploadAvatar(formData) {
  return request({
    url: '/api/files/upload/avatar',
    method: 'post',
    data: formData
  });
}
