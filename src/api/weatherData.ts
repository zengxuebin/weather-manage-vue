import request from '@/utils/request'

/**
 * 采集数据
 * @returns 采集结果
 */
export const getNowWeather = () => {
  return request({
    method: 'post',
    url: '/weatherData/collect',
  })
}

/**
 * 分页获取气象数据
 * @returns 分气象数据
 */
export const getPageWeatherData = (data: any) => {
  return request({
    method: 'post',
    url: '/weatherData/page',
    data
  })
}
