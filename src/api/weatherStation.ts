import request from '@/utils/request'

/**
 * 获取所有监测站
 * @returns 监测站列表
 */
export const getAllStation = () => {
  return request({
    method: 'get',
    url: '/weather/station/list'
  })
}

/**
 * 获取所有城市
 * @returns 城市列表
 */
export const getAllCity = () => {
  return request({
    method: 'get',
    url: '/weather/station/city/list'
  })
}

/**
 * 根据城市查询监测站
 * @returns 监测站列表
 */
export const getStationByCity = (city: string) => {
  return request({
    method: 'get',
    url: '/weather/station/list/' + city,
  })
}

/**
 * 统计监测站个数
 * @returns 监测站列表
 */
export const countStation = () => {
  return request({
    method: 'get',
    url: '/weather/station/count',
  })
}
