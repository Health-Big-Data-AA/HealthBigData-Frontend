import request from '../router/request.js';

/**
 * 根据ID查询日志
 */
export function getLogById(id) {
    return request({
        url: `/api/logs/${id}`, // 请求的 URL
        method: 'get',              // 请求方法

    });
}

/**
 * 【更新】分页并按条件查询日志列表
 * @param queryDto 查询条件 DTO
 * @return 分页的日志数据
 */
export function searchLogs(data) {
    return request({
        url: `/api/logs/search`, // 请求的 URL
        method: 'post',              // 请求方法
        data                   // 发送到后端的数据
    });
}






















