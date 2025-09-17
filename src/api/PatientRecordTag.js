import request from '../utils/request.js';

/**
 * 为记录添加标签
 * @param {object} data - 包含 recordId 和 tagId 的对象, e.g., { recordId: 1, tagId: 2 }
 * @returns Promise
 */
export function addTagToRecord(data) {
  return request({
    url: '/api/record-tags',
    method: 'post',
    data
  })
}
/**
 * 从记录中移除标签
 * @param {object} data - 包含 recordId 和 tagId 的对象, e.g., { recordId: 1, tagId: 2 }
 * @returns Promise
 */
export function removeTagFromRecord(data) {
  return request({
    url: '/api/record-tags',
    method: 'delete',
    data
  })
}

/**
 * 查询指定记录的所有标签
 * @param {number} recordId - 记录ID
 * @returns Promise
 */
export function getTagsByRecordId(recordId) {
  return request({
    url: `/api/record-tags/record/${recordId}`,
    method: 'get'
  })
}

/**
 * 查询带有指定标签的所有记录
 * @param {number} tagId - 标签ID
 * @returns Promise
 */
export function getRecordsByTagId(tagId) {
  return request({
    url: `/api/record-tags/tag/${tagId}`,
    method: 'get'
  })
}
