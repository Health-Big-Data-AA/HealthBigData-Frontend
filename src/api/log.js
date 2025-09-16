// src/api/log.js
import request from '@/utils/request'; // 引入您封装的 axios 实例

// 查询操作日志列表
export function listLogs(query) {
  return request({
    url: '/api/logs/list', // 后端接口地址
    method: 'get',
    params: query
  });
}
