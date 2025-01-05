import request from "@/utils/request";

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function getHomeInfo() {
  return request({
    method: 'get',
    url: '/home'
  })
}