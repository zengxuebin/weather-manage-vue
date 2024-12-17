import axios from "axios";
import { ElMessage, ElNotification } from 'element-plus'
import useUserStore from "@/stores/user";
import router from "@/router/index";

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

// 处理 类型“AxiosResponse<any, any>”上不存在属性
declare module "axios" {
  interface AxiosResponse<T = any> {
    img: string,
    uuid: string,
    token: string,
    user: any,
    roles: any,
    permissions: any,
    dept: any,
    statistics: any,
    tempList: any,
    cityCount: any,
    typeCount: any,
    precipitation: any,
    desc: any,
    weatherNow: any,
  }
}

// 创建实例
const service = axios.create({
  // 请求地址
  baseURL: '/weather',
  // 超时
  timeout: 10000,
});

// 添加请求拦截器
service.interceptors.request.use(config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false

  const token = localStorage.getItem("token");

  if (token && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + token
  }

  return config;
}, error => {

  return Promise.reject(error)
});

// 添加响应拦截器
service.interceptors.response.use(res => {
  // 未设置状态码则默认成功状态
  const code = res.data.code;
  // 获取错误信息
  const msg = res.data.msg;

  if (code === 401) {
    useUserStore().logoutUser()
    return Promise.reject('token已过期, 请重新登录。')
  }

  if (code === 601) {
    // 关闭之前的通知
    ElNotification.closeAll();
    res.data.data.forEach((item: any) => {
      ElNotification({
        title: 'Success',
        message: '已将预警信息推送至' + item.nickname + '的邮箱和短信中',
        type: 'success',
      })
    })
    return Promise.resolve(msg)
  }

  if (code != 200) {
    ElMessage.error(msg)
    return Promise.reject(msg)
  }

  return Promise.resolve(res.data)
}, error => {
  const errorData = JSON.parse(error.request.response)
  if (errorData.msg) {  // 判断是否有message属性
    ElMessage.error(errorData.msg)
  }
  return Promise.reject(errorData);
});

// 暴露service
export default service;