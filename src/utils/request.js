import axios from 'axios'
import useAuthStore from '../stores/useAuthStore'

const baseURL = 'http://localhost:3000'

const instance = axios.create({
  baseURL,
  timeout: 5000
})

//请求拦截器,所有请求都携带token
instance.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.token = authStore.token
  }
  return config
})

//响应拦截器
instance.interceptors.response.use(
  (response) => {
    //判断响应体的类型是否为Blob，如果是，则来自于下载接口
    const isBlob = response.data instanceof Blob
    if (isBlob) {
      const contentType = response.headers['content-type']
      if (contentType && contentType.includes('application/json')) {
        //此时响应体虽然是blob形式，但里面其实是json
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            try {
              reject(JSON.parse(reader.result))
            } catch (e) {
              reject(e)
            }
          }
          reader.readAsText(response.data)
        })
      } else {
        // 如果是成功的Blob,返回整个响应
        return response
      }
    } else {
      //如果不是，则来自于其他普通接口
      return response.data
    }
  },
  (error) => {
    return Promise.reject(error.response.data)
  }
)

export default instance
export { baseURL }
