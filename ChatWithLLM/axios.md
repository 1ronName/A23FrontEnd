## 为什么需要 axios？

| 用途                | 说明                                                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **调用后端 API**    | 你的智能公文处理系统需要登录、上传文件、调用大模型等，全部需要通过 HTTP 请求与后端通信                           |
| **比 fetch 更好用** | 浏览器自带的 `fetch` 虽然能用，但 axios 提供了更便捷的特性：自动转换 JSON、请求/响应拦截器、超时设置、取消请求等 |
| **统一处理错误**    | 可以用拦截器统一处理 token 过期、错误提示，避免每个请求都写重复代码                                              |
| **文件上传更简单**  | 处理 FormData、监听上传进度等，axios 用起来更顺手                                                                |

---

## 项目中最简使用示例

### 1. 新建 `src/utils/request.js`

```javascript
import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:8080/api', // 你的后端地址
  timeout: 10000,
})

// 请求拦截器（自动附上 token）
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器（统一处理错误）
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('请求失败:', error)
    return Promise.reject(error)
  },
)

export default request
```

### 2. 在组件中使用

```javascript
import request from '@/utils/request'

// 登录
const login = async () => {
  const res = await request.post('/auth/login', {
    username: 'admin',
    password: '123456',
  })
  console.log(res)
}

// 上传文件
const upload = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await request.post('/doc/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res
}
```

---

## 总结

- **必须装**，整个系统的前后端交互全靠它
- 体积小（~12kB），功能强
- 一次配置，全项目通用
