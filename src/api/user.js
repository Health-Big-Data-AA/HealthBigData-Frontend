import request from '@/utils/request';

// 分页查询用户列表
export function listUsers(query) {
  return request({
    url: '/api/users/page',
    method: 'get',
    params: query
  });
}

// 根据用户ID查询用户信息
export function getUser(userId) {
  return request({
    url: `/api/users/${userId}`,
    method: 'get'
  });
}

// 新增用户 (注意：后端此接口不处理密码)
export function addUser(data) {
  return request({
    url: '/api/users',
    method: 'post',
    data: data
  });
}

// 更新用户信息
export function updateUser(data) {
  return request({
    url: '/api/users',
    method: 'put',
    data: data
  });
}

// 逻辑删除用户
export function delUser(userId) {
  return request({
    url: `/api/users/${userId}`,
    method: 'delete'
  });
}
