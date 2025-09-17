import request from '../router/request.js';

/**
 * 为角色分配权限
 * @param {object} data - 包含 roleId 和 permissionId 的对象, e.g., { roleId: 1, permissionId: 2 }
 * @returns Promise
 */
export function assignPermissionToRole(data) {
  return request({
    url: '/api/role-permissions',
    method: 'post',
    data
  })
}

/**
 * 取消角色的某个权限
 * @param {object} data - 包含 roleId 和 permissionId 的对象, e.g., { roleId: 1, permissionId: 2 }
 * @returns Promise
 */
export function removePermissionFromRole(data) {
  return request({
    url: '/api/role-permissions',
    method: 'delete',
    data
  })
}

/**
 * 查询某个角色的所有权限ID
 * @param {number} roleId - 角色ID
 * @returns Promise
 */
export function getPermissionsByRoleId(roleId) {
  return request({
    url: `/api/role-permissions/role/${roleId}`,
    method: 'get'
  })
}
