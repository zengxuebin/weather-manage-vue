import request from '@/utils/request'

/**
 * 获取预测天气数据
 * @returns 预测天气
 */
export const getForecastWeather = (location: string) => {
  return request({
    method: 'get',
    url: '/forecast/' + location,
  })
}