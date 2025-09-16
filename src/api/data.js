import request from '@/utils/request';

// 分页查询患者记录列表
export function listRecords(query) {
  return request({
    url: '/api/records/page',
    method: 'get',
    params: query
  });
}

// 导出患者记录
export function exportRecords() {
  return request({
    url: '/api/records/export',
    method: 'get',
    responseType: 'blob' // 表明返回的是文件流
  });
}
