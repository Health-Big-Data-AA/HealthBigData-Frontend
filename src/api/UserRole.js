import request from '../utils/request.js';


/**
 * 为用户分配角色
 * @param {object} data - 包含 userId 和 roleId 的对象, e.g., { userId: 1, roleId: 2 }
 * @returns Promise
 */
export function assignRoleToUser(data) {
  return request({
    url: '/api/user-roles',
    method: 'post',
    data
  })
}

/**
 * 取消用户的某个角色
 * @param {object} data - 包含 userId 和 roleId 的对象, e.g., { userId: 1, roleId: 2 }
 * @returns Promise
 */
export function removeRoleFromUser(data) {
  return request({
    url: '/api/user-roles',
    method: 'delete',
    data
  })
}

/**
 * 查询某个用户的所有角色ID
 * @param {number} userId - 用户ID
 * @returns Promise
 */
export function getRolesByUserId(userId) {
  return request({
    url: `/api/user-roles/user/${userId}`,
    method: 'get'
  })
}
