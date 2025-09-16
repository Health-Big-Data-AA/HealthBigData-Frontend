import request from '@/utils/request';

// 获取描述性统计
export function getStatistics() {
  return request({
    url: '/api/statistics',
    method: 'get'
  });
}

// 获取分组对比统计
export function getGroupedStatistics() {
  return request({
    url: '/api/statistics/grouped-by-type',
    method: 'get'
  });
}

// 获取相关性分析
export function getCorrelation() {
  return request({
    url: '/api/statistics/correlation',
    method: 'get'
  });
}

// 获取趋势分析
export function getTrend() {
  return request({
    url: '/api/statistics/trend/weight-by-month',
    method: 'get'
  });
}
