import request from '../utils/request.js';

/**
 * 新增权限
 * @param {object} data - 权限数据, e.g., { permissionCode: 'user:create', permissionName: '创建用户' }
 * @returns Promise
 */
export function addPermission(data) {
  return request({
    url: '/api/permissions',
    method: 'post',
    data
  })
}

/**
 * 根据ID删除权限
 * @param {number} id - 权限ID
 * @returns Promise
 */
export function deletePermission(id) {
  return request({
    url: `/api/permissions/${id}`,
    method: 'delete'
  })
}

/**
 * 更新权限信息
 * @param {object} data - 权限数据
 * @returns Promise
 */
export function updatePermission(data) {
  return request({
    url: '/api/permissions',
    method: 'put',
    data
  })
}

/**
 * 根据ID查询权限
 * @param {number} id - 权限ID
 * @returns Promise
 */
export function getPermissionById(id) {
  return request({
    url: `/api/permissions/${id}`,
    method: 'get'
  })
}

/**
 * 分页查询权限列表
 * @param {object} params - 分页参数, e.g., { pageNo: 1, pageSize: 10 }
 * @returns Promise
 */
export function listPermissionsByPage(params) {
  return request({
    url: '/api/permissions/page',
    method: 'get',
    params
  })
}
