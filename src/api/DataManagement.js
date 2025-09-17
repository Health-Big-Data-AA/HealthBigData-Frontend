import request from '../router/request.js';

/**
 * 执行数据清洗任务
 * 查找身高或体重数据不合规的记录
 */
export function cleanseData() {
    return request({
        url: '/api/data-management/cleanse', // 请求的 URL
        method: 'post',              // 请求方法

    });
}

/**
 * 【新增】执行数据去重任务
 * 根据 patient_identifier 字段查找重复记录，并保留最新的一条
 */
export function deduplicateData() {
    return request({
        url: '/api/data-management/deduplicate', // 请求的 URL
        method: 'post',              // 请求方法

    });
}
