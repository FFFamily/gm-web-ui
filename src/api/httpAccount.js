import axios from 'axios'
import { ElMessage } from 'element-plus'
import { ACCOUNT_TOKEN_KEY } from '~/constants/accountAuth'

/**
 * Axios instance for front-end Account APIs.
 *
 * Response contract (wrapped): { code: number, message: string, data: any }
 * Auth header: satoken: <token>
 */
const httpAccount = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000
})

httpAccount.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCOUNT_TOKEN_KEY)
  if (token) {
    config.headers = config.headers || {}
    // Backend expects Sa-Token default header name: `satoken`
    config.headers.satoken = token
  }
  return config
})

httpAccount.interceptors.response.use(
  (response) => {
    const payload = response?.data
    if (!payload || typeof payload !== 'object' || !('code' in payload)) return payload
    if (payload.code === 0) return payload.data

    if (!response.config?.meta?.silenceError) {
      ElMessage.error(payload.message || '请求失败')
    }
    return Promise.reject(new Error(payload.message || 'Request error'))
  },
  (error) => {
    const status = error?.response?.status
    const silence = error?.config?.meta?.silenceError

    if (status === 401) {
      localStorage.removeItem(ACCOUNT_TOKEN_KEY)
      if (!silence) ElMessage.error('登录已过期，请重新登录')
      const redirect = `${window.location.pathname}${window.location.search}${window.location.hash}`
      if (!window.location.pathname.startsWith('/account/login')) {
        window.location.href = `/account/login?redirect=${encodeURIComponent(redirect)}`
      }
      return Promise.reject(error)
    }

    if (!silence) {
      ElMessage.error(error?.message || '网络错误')
    }
    return Promise.reject(error)
  }
)

export default httpAccount

