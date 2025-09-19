import request from '../utils/request.js';

/**
 * 获取所有数据导入批次列表
 * @returns Promise
 */
export function getAllBatches() {
  return request({
    url: '/api/batches',
    method: 'get'
  });
}
