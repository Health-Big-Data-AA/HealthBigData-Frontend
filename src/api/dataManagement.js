import request from '@/utils/request';

// 执行数据清洗
export function cleanseData() {
  return request({
    url: '/api/data-management/cleanse',
    method: 'post'
  });
}

// 执行数据去重
export function deduplicateData() {
  return request({
    url: '/api/data-management/deduplicate',
    method: 'post'
  });
}
