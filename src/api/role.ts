import request from '@/utils/request'

/**
 * 分页获取角色
 * @returns 分页角色
 */
export const getPageRole = (data: any) => {
  return request({
    method: 'post',
    url: '/system/role/page',
    data
  })
}
