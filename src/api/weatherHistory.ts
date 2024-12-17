import request from '@/utils/request'

/**
 * 获取历史天气统计量
 * @returns 历史天气统计
 */
export const getHistoryStatistics = (data: any) => {
  return request({
    method: 'post',
    url: '/history/statistics',
    data
  })
}