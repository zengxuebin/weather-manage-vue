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
 * 新增用户
 * @returns 是否新增成功
 */
export const addUser = (data: any) => {
  return request({
    method: 'post',
    url: '/system/user/add',
    data
  })
}

/**
 * 更新用户
 * @returns 是否更新成功
 */
export const updateUser = (data: any) => {
  return request({
    method: 'post',
    url: '/system/user/update',
    data
  })
}

/**
 * 删除用户
 * @returns 是否删除成功
 */
export const deleteUser = (data: any) => {
  return request({
    method: 'post',
    url: '/system/user/delete',
    data
  })
}

/**
 * 批量删除用户
 * @returns 是否删除成功
 */
export const batchDeleteUser = (data: any) => {
  return request({
    method: 'post',
    url: '/system/user/batchDelete',
    data
  })
}