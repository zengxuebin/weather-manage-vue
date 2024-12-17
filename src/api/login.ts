import request from '@/utils/request'

/**
 * 登录
 * @param data username password code
 * @returns token 
 */
export function login(data: any) {
  return request({
    method: 'post',
    headers: {
      isToken: false
    },
    url: '/auth/login',
    data
  })
}

/**
 * 获取验证码
 * @returns 验证码
 */
export function getCodeImg() {
  return request({
    method: 'get',
    headers: {
      isToken: false
    },
    url: '/code/captchaImage',
  })
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function getInfo() {
  return request({
    method: 'get',
    url: '/auth/getUserInfo'
  })
}

/**
 * 退出登录
 * @returns 结果
 */
export function logout() {
  return request({
    method: 'post',
    url: '/auth/logout'
  })
}
