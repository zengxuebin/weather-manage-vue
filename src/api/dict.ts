import request from '@/utils/request'

/**
 * 分页获取字典类型
 * @returns 分页角色
 */
export const getPageDict = (data: any) => {
  return request({
    method: 'post',
    url: '/system/dict/type/page',
    data
  })
}

/**
 * 获取键值列表
 * @returns 键值列表
 */
export const getDictDataListByDictType = (dictType: string) => {
  return request({
    method: 'get',
    url: '/system/dict/data/list/' + dictType,
  })
}

/**
 * 获取键值列表
 * @returns 键值列表
 */
export const getDictListByType = (dictType: string) => {
  return request({
    method: 'get',
    url: '/system/dict/data/type/' + dictType,
  })
}
