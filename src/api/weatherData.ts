import request from '@/utils/request'

/**
 * 采集数据
 * @returns 采集结果
 */
export const getNowWeather = () => {
  return request({
    method: 'post',
    url: '/weather/data/collect',
  })
}

/**
 * 采集指定日期的气象数据
 * @returns 采集结果
 */
export const getWeatherByDate = (date: string) => {
  return request({
    method: 'post',
    url: '/weather/data/collect/' + date,
  })
}

