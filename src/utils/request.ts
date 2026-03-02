import axios from 'axios'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
})

service.interceptors.response.use(
  (response) => response,
  (error) => {
    // 简单错误处理
    console.error('请求错误', error)
    return Promise.reject(error)
  },
)

export default service
//作用：封装HTTP请求
//需要完成：axios 实例
// baseURL
// 超时
// 响应拦截器
// 错误处理
