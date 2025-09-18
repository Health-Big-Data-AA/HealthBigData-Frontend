import request from '../utils/request.js';

/**
 * 新增患者记录
 */
export function addRecord(data) {
    return request({
        url: '/api/records', // 请求的 URL
        method: 'post',              // 请求方法
        data                   // 发送到后端的数据
    });
}

/**
 * 根据ID删除记录 (逻辑删除)
 */
export function deleteRecord(id) {
  return request({
    url: `/api/records/${id}`, // 请求的 URL
    method: 'delete',              // 请求方法

  });
}

/**@
 * 更新记录信息
 */
export function updateRecord(data){
  return request({
    url: '/api/records', // 请求的 URL
    method: 'post',              // 请求方法
    data
  });
}
/**
 * 根据ID查询记录
 */
export function getRecordById(id) {
  return request({
    url: `/api/records/${id}`, // 请求的 URL
    method: 'get',              // 请求方法

  });
}

/**
 * 分页查询记录列表
 */
export function listRecordsByPage(params) {
  return request({
    url: '/api/records/page', // 请求的 URL
    method: 'get',              // 请求方法
    params                   // 发送到后端的数据
  });
}

/**
 * 【新增】通过上传Excel文件批量导入患者记录
 */
export function importRecords(formData) {
  return request({
    url: '/api/records/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 【新增】将患者记录导出为Excel文件
 */
export function exportRecords() {
  return request({
    url: '/api/records/export', // 请求的 URL
    method: 'get',              // 请求方法
    responseType: 'blob' // 告诉axios期望接收一个二进制文件
  });
}
