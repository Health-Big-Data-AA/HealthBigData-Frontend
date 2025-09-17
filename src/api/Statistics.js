import request from '../utils/request.js';

/**
 * 获取患者记录的描述性统计信息
 * @returns Promise
 */
export function getPatientRecordStatistics() {
  return request({
    url: '/api/statistics',
    method: 'get'
  })
}

/**
 * 按记录类型获取分组的描述性统计信息
 * @returns Promise
 */
export function getGroupedStatistics() {
  return request({
    url: '/api/statistics/grouped-by-type',
    method: 'get'
  })
}

/**
 * 获取身高和体重的相关性分析结果
 * @returns Promise
 */
export function getCorrelation() {
  return request({
    url: '/api/statistics/correlation',
    method: 'get'
  })
}

/**
 * 获取平均体重的月度趋势分析
 * @returns Promise
 */
export function getWeightTrendByMonth() {
  return request({
    url: '/api/statistics/trend/weight-by-month',
    method: 'get'
  })
}
