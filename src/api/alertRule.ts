import request from '@/utils/request'

/**
 * 分页获取预警规则
 * @returns 分页预警规则
 */
export const getPageAlertRule = (data: any) => {
  return request({
    method: 'post',
    url: '/alert/rule/page',
    data
  })
}

/**
 * 预警规则列表
 * @returns 预警规则列表
 */
export const getAllAlertRule = () => {
  return request({
    method: 'get',
    url: '/alert/rule/list',
  })
}
