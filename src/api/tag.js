import request from '@/utils/request';

// 获取所有标签
export function getAllTags() {
  return request({
    url: '/api/tags',
    method: 'get'
  });
}

// 创建新标签
export function createTag(data) {
  return request({
    url: '/api/tags',
    method: 'post',
    data: data
  });
}

// 删除标签
export function deleteTag(tagId) {
  return request({
    url: `/api/tags/${tagId}`,
    method: 'delete'
  });
}
