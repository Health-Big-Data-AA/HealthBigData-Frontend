import request from '@/utils/request';

// 搜索并分页查询日志列表
export function searchLogs(data) {
  return request({
    url: '/api/logs/search',
    method: 'post',
    data: data
  });
}
