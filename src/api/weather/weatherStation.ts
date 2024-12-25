import request from '@/utils/request'


/**
 * 分页获取监测站信息
 * @returns 分页监测站
 */
export const getPageStation = (data: any) => {
  return request({
    method: 'post',
    url: '/weather/station/page',
    data
  })
}

/**
 * 新增监测站
 * @returns 是否新增成功
 */
export const addStation = (data: any) => {
  return request({
    method: 'post',
    url: '/weather/station/add',
    data
  })
}

/**
 * 更新监测站
 * @returns 是否更新成功
 */
export const updateStation = (data: any) => {
  return request({
    method: 'post',
    url: '/weather/station/update',
    data
  })
}

/**
 * 删除监测站
 * @returns 是否删除成功
 */
export const deleteStation = (data: any) => {
  return request({
    method: 'post',
    url: '/weather/station/delete',
    data
  })
}

/**
 * 批量删除监测站
 * @returns 是否删除成功
 */
export const batchDeleteStation = (data: any) => {
  return request({
    method: 'post',
    url: '/weather/station/batchDelete',
    data
  })
}