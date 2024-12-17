import request from '@/utils/request'

/**
 * 获取路由
 * @returns 路由 
 */
export const getRouters = () => {
  return request({
    method: 'get',
    url: '/auth/getRouters'
  })
}

/**
 * 分页获取菜单
 * @returns 分页菜单列表
 */
export const getPageMenu = (data: any) => {
  return request({
    method: 'post',
    url: '/system/menu/page',
    data
  })
}
