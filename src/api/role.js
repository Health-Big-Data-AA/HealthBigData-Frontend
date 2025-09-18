import request from '@/utils/request';

// 分页查询角色列表
export function listRoles(query) {
  return request({
    url: '/api/roles/page',
    method: 'get',
    params: query
  });
}

// 根据ID查询单个角色信息
export function getRole(roleId) {
  return request({
    url: `/api/roles/${roleId}`,
    method: 'get'
  });
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/api/roles',
    method: 'post',
    data: data
  });
}

// 更新角色信息
export function updateRole(data) {
  return request({
    url: '/api/roles',
    method: 'put',
    data: data
  });
}

// 逻辑删除角色
export function delRole(roleId) {
  return request({
    url: `/api/roles/${roleId}`,
    method: 'delete'
  });
}
