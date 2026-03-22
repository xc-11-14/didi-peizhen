import axios from 'axios'
import { ElMessage } from 'element-plus'

const http = axios.create({
    baseURL: 'https://v3pz.itndedu.com/v3pz',
    timeout: 10000
})

// 添加请求拦截器
http.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('pz_token')
    //不需要添加token的接口
    const whiteURL = ['/user/authentication', '/get/code', '/login']
    if (token && !whiteURL.includes(config.url || '')) {
        config.headers['x-token'] = token
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
// 响应拦截器（基于你的代码修改，仅修复核心取值问题）
http.interceptors.response.use(function (response) {
  // 对接口异常的数据给用户提示
  if (response.data.code === -1) {
    ElMessage.warning(response.data.message)
  }
  if (response.data.code === -2) {
    localStorage.removeItem('pz_token')
    localStorage.removeItem('pz_userInfo')
    localStorage.removeItem('menu')
    ElMessage.warning('登录过期，请重新登录')
    window.location.href = window.location.origin + '/login'
  }
  // 2xx 范围内的状态码都会触发该函数，返回完整响应
  return response;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数，统一抛出错误
  return Promise.reject(error);
});

export default http