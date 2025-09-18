import request from '../utils/request.js';

/**
 * 新增用户
 * @param {object} data - 用户数据
 * @returns Promise
 */
export function addUser(data) {
  return request({
    url: '/api/users',
    method: 'post',
    data
  })
}

/**
 * 根据ID删除用户 (逻辑删除)
 * @param {number} id - 用户ID
 * @returns Promise
 */
export function deleteUser(id) {
  return request({
    url: `/api/users/${id}`, // RESTful风格，ID在路径中
    method: 'delete'
  })
}

/**
 * 更新用户信息
 * @param {object} data - 包含ID的完整用户数据
 * @returns Promise
 */
export function updateUser(data) {
  return request({
    url: '/api/users',
    method: 'put', // 更新操作使用 PUT 方法
    data
  })
}

/**
 * 根据ID查询用户
 * @param {number} id - 用户ID
 * @returns Promise
 */
export function getUserById(id) {
  return request({
    url: `/api/users/${id}`, // RESTful风格
    method: 'get'
  })
}

/**
 * 分页查询用户列表
 * @param {object} params - 分页和查询参数, e.g., { pageNo: 1, pageSize: 10 }
 * @returns Promise
 */
export function listUsersByPage(params) {
  return request({
    url: '/api/users/page', // 后端分页查询的URL
    method: 'get',
    params // GET请求的参数使用params
  })
}
