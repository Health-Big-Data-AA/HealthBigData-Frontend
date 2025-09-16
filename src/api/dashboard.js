// src/api/dashboard.js
import request from '@/utils/request'; // 引入您封装的 axios 实例

/**
 * 获取仪表盘的核心统计数据和图表数据
 * 通常后端会提供一个聚合接口，一次性返回所有数据，以提高加载效率
 */
export function getDashboardData() {
  return request({
    url: '/api/dashboard/summary', // 后端接口地址
    method: 'get'
  });
}
