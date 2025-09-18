import request from '../utils/request.js';

/**
 * 获取仪表盘摘要数据
 * @returns Promise - 响应体包含面板数据 (panelData) 和趋势图数据 (trendData)
 */
export function getDashboardSummary() {
  return request({
    url: '/api/dashboard/summary',
    method: 'get'
  })
}
