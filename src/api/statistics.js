// src/api/statistics.js
import request from '@/utils/request'; // 引入您封装的 axios 实例

// 获取患者年龄分布数据
export function getAgeDistribution(query) {
  return request({
    url: '/api/stats/age-distribution',
    method: 'get',
    params: query
  });
}

// 获取记录类型统计数据
export function getRecordTypeStats(query) {
  return request({
    url: '/api/stats/record-type',
    method: 'get',
    params: query
  });
}

// 获取每日新增记录趋势数据
export function getDailyTrend(query) {
  return request({
    url: '/api/stats/daily-trend',
    method: 'get',
    params: query
  });
}
