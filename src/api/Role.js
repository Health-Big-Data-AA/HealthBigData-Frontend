import request from '../utils/request.js';

/**
 * 新增角色
 * @param {object} data - 角色数据, e.g., { roleCode: 'ADMIN', roleName: '管理员' }
 * @returns Promise
 */
export function addRole(data) {
  return request({
    url: '/api/roles',
    method: 'post',
    data
  })
}

/**
 * 根据ID删除角色 (逻辑删除)
 * @param {number} id - 角色ID
 * @returns Promise
 */
export function deleteRole(id) {
  return request({
    url: `/api/roles/${id}`,
    method: 'delete'
  })
}

/**
 * 更新角色信息
 * @param {object} data - 角色数据
 * @returns Promise
 */
export function updateRole(data) {
  return request({
    url: '/api/roles',
    method: 'put',
    data
  })
}

/**
 * 根据ID查询角色
 * @param {number} id - 角色ID
 * @returns Promise
 */
export function getRoleById(id) {
  return request({
    url: `/api/roles/${id}`,
    method: 'get'
  })
}

/**
 * 分页查询角色列表
 * @param {object} params - 分页参数, e.g., { pageNo: 1, pageSize: 10 }
 * @returns Promise
 */
export function listRolesByPage(params) {
  return request({
    url: '/api/roles/page',
    method: 'get',
    params
  })
}
