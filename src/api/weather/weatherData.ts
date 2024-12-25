import request from '@/utils/request'


/**
 * 分页获取气象信息
 * @returns 分页气象
 */
export const getPageWeather = (data: any) => {
  return request({
    method: 'post',
    url: '/weather/data/page',
    data
  })
}

/**
 * 新增气象
 * @returns 是否新增成功
 */
export const addWeather = (data: any) => {
  return request({
    method: 'post',
    url: '/weather/data/add',
    data
  })
}

/**
 * 更新气象
 * @returns 是否更新成功
 */
export const updateWeather = (data: any) => {
  return request({
    method: 'post',
    url: '/weather/data/update',
    data
  })
}

/**
 * 删除气象
 * @returns 是否删除成功
 */
export const deleteWeather = (data: any) => {
  return request({
    method: 'post',
    url: '/weather/data/delete',
    data
  })
}

/**
 * 批量删除气象
 * @returns 是否删除成功
 */
export const batchDeleteWeather = (data: any) => {
  return request({
    method: 'post',
    url: '/weather/data/batchDelete',
    data
  })
}