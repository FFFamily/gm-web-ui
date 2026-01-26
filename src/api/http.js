import axios from 'axios'
import { ElMessage } from 'element-plus'
import { TOKEN_KEY } from '~/constants/auth'

/**
 * Axios instance for GM Admin APIs.
 *
 * Response contract (wrapped): { code: number, message: string, data: any }
 * Auth header: satoken: <token>
 */
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers = config.headers || {}
    config.headers[TOKEN_KEY] = token
  }
  return config
})

http.interceptors.response.use(
  (response) => {
    const payload = response?.data
    // Non-standard responses: return as-is.
    if (!payload || typeof payload !== 'object' || !('code' in payload)) return payload

    if (payload.code === 0) return payload.data

    // Allow per-request silence (e.g. login page wants a fixed error message).
    if (!response.config?.meta?.silenceError) {
      ElMessage.error(payload.message || '请求失败')
    }
    return Promise.reject(new Error(payload.message || 'Request error'))
  },
  (error) => {
    const status = error?.response?.status
    const silence = error?.config?.meta?.silenceError

    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      if (!silence) ElMessage.error('登录已过期，请重新登录')
      // Avoid importing router here to prevent circular deps (router -> store -> api -> http -> router).
      const redirect = `${window.location.pathname}${window.location.search}${window.location.hash}`
      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.href = `/admin/login?redirect=${encodeURIComponent(redirect)}`
      }
      return Promise.reject(error)
    }

    if (status === 403) {
      if (!silence) ElMessage.error('无权限')
      return Promise.reject(error)
    }

    if (!silence) {
      ElMessage.error(error?.message || '网络错误')
    }
    return Promise.reject(error)
  }
)

export default http
