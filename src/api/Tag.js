import request from '../router/request.js';


/**
 * 创建新标签
 * @param {object} data - 标签数据, e.g., { tagName: '高血压' }
 * @returns Promise
 */
export function createTag(data) {
  return request({
    url: '/api/tags',
    method: 'post',
    data
  })
}

/**
 * 获取所有标签列表
 * @returns Promise
 */
export function getAllTags() {
  return request({
    url: '/api/tags',
    method: 'get'
  })
}

/**
 * 根据ID删除标签
 * @param {number} id - 标签ID
 * @returns Promise
 */
export function deleteTag(id) {
  return request({
    url: `/api/tags/${id}`,
    method: 'delete'
  })
}
