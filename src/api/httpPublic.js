import axios from 'axios'
import { ElMessage } from 'element-plus'

/**
 * Axios instance for public APIs (no auth header).
 *
 * Response contract (wrapped): { code: number, message: string, data: any }
 */
const httpPublic = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 15000
})

httpPublic.interceptors.response.use(
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
    const silence = error?.config?.meta?.silenceError
    if (!silence) ElMessage.error(error?.message || '网络错误')
    return Promise.reject(error)
  }
)

export default httpPublic

