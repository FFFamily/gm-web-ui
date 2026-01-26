import http from './http'

export const apiLogin = (body) =>
  http.post('/api/auth/login', body, { meta: { silenceError: true } })

export const apiMe = () => http.get('/api/auth/me')

