import request from '@/utils/request'

/**
 * 分页获取用户信息
 * @returns 分页用户
 */
export const getPageUser = (data: any) => {
  return request({
    method: 'post',
    url: '/system/user/page',
    data
  })
}

/**
 * 分页获取在线用户
 * @returns 在线用户
 */
export const getPageOnlineUser = (data: any) => {
  return request({
    method: 'post',
    url: '/system/user/online/page',
    data
  })
}
