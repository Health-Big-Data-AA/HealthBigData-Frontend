// src/api/data.js

import request from '@/utils/request'; // 引入您封装的 axios 实例

// 查询患者健康记录列表
export function listRecords(query) {
  return request({
    url: '/api/data/list', // 后端接口地址
    method: 'get',
    params: query
  });
}

// 导出患者健康记录
export function exportRecords(query) {
  return request({
    url: '/api/data/export', // 后端导出接口地址
    method: 'get',
    params: query,
    responseType: 'blob' // 表明返回的是文件流
  });
}

// 注意: 上传操作通常直接在 el-upload 组件的 action 属性中指定 URL，
// 所以这里不需要单独封装上传的 API 函数。
