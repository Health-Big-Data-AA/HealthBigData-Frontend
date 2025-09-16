// src/api/dashboard.js
import request from '@/utils/request';

/**
 * 获取仪表盘的核心统计数据和图表数据
 */
export function getDashboardData() {
  return request({
    url: '/api/dashboard/summary', // 后端接口地址
    method: 'get'
  });
}
