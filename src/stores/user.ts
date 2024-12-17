import { ref } from 'vue'
import { defineStore } from 'pinia'
import { login, getInfo, logout } from '@/api/login'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token'))
  const user  = ref()
  const roles = ref([])
  const permissions = ref([])
  const dept = ref()

  /**
   * 登陆
   * @param userInfo 表单
   * @returns token
   */
  function loginUser(userInfo: any) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(res => {
        localStorage.setItem('token', res.token)
        token.value = res.token
        console.log(res);
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * 获取用户信息
   * @returns 用户信息
   */
  function getUserInfo() {
    return new Promise((resolve, reject) => {
      getInfo().then(res => {
        console.log(res);
        if (res.roles && res.roles.length > 0) {
          roles.value = res.roles
          permissions.value = res.permissions
          dept.value = res.dept
        }
        user.value = res.user
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
   * 退出登录
   * @returns 结果 
   */
  function logoutUser() {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        localStorage.removeItem('token')
        token.value = ''
        roles.value = []
        permissions.value = []
        resolve('')
        router.push('/login')
      }).catch(error => {
        localStorage.removeItem('token')
        router.push('/login')
        reject(error)
      })
    })
  }

  return { token, user, dept, roles, permissions, loginUser, getUserInfo, logoutUser }
})

export default useUserStore
