import request from '@/utils/request'

/**
 * 分页获取待处理预警信息
 * @returns 分页待处理预警信息
 */
export const getPageReleaseAlert = (data: any) => {
  return request({
    method: 'post',
    url: '/alert/release/page',
    data
  })
}

/**
 * 分页获取待推送预警信息
 * @returns 分页待推送预警信息
 */
export const getPagepushAlert = (data: any) => {
  return request({
    method: 'post',
    url: '/alert/push/page',
    data
  })
}

/**
 * 分页获取所有预警信息
 * @returns 分页待处理预警信息
 */
export const getPageAllAlert = (data: any) => {
  return request({
    method: 'post',
    url: '/alert/page',
    data
  })
}

/**
 * 分页获取待处理预警信息
 * @returns 分页待处理预警信息
 */
export const generateReleaseAlert = () => {
  return request({
    method: 'post',
    url: '/alert/release/generate',
  })
}

/**
 * 分页获取待处理预警信息
 * @returns 分页待处理预警信息
 */
export const getListPushedAlert = () => {
  return request({
    method: 'get',
    url: '/alert/pushed/list',
  })
}

/**
 * 忽略预警信息
 * @returns 结果
 */
export const handleAlertIgnore = (data: any) => {
  return request({
    method: 'post',
    url: '/alert/ignore/handle',
    data
  })
}

/**
 * 发布预警信息
 * @returns 结果
 */
export const handleAlertRelease = (data: any) => {
  return request({
    method: 'post',
    url: '/alert/release/handle',
    data
  })
}

/**
 * 推送预警信息
 * @returns 结果
 */
export const handleAlertPush = (data: any) => {
  return request({
    method: 'post',
    url: '/alert/push/handle',
    data
  })
}
