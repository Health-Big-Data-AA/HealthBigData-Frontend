import request from '@/utils/request';

// 分页查询患者记录列表
export function listRecords(query) {
  return request({
    url: '/api/records/page',
    method: 'get',
    params: query
  });
}

// 根据ID查询单条记录
export function getRecord(recordId) {
  return request({
    url: `/api/records/${recordId}`,
    method: 'get'
  });
}

// 新增一条患者记录
export function addRecord(data) {
  return request({
    url: '/api/records',
    method: 'post',
    data: data
  });
}

// 更新一条患者记录
export function updateRecord(data) {
  return request({
    url: '/api/records',
    method: 'put',
    data: data
  });
}

// 逻辑删除一条记录
export function delRecord(recordId) {
  return request({
    url: `/api/records/${recordId}`,
    method: 'delete'
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
