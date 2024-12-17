import request from '@/utils/request'

/**
 * 获取未来两小时降水量
 * @returns 降水量
 */
export const getNowWeather = (location: string) => {
  return request({
    method: 'get',
    url: '/now/' + location,
  })
}