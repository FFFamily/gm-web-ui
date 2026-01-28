import http from './http'

export const apiUserList = (params) => http.get('/api/users', { params })
export const apiUserDetail = (id) => http.get(`/api/users/${id}`)
export const apiUserCreate = (body) => http.post('/api/users', body)
export const apiUserUpdate = (id, body) => http.put(`/api/users/${id}`, body)
export const apiUserResetPassword = (id, body) => http.post(`/api/users/${id}/reset-password`, body)
