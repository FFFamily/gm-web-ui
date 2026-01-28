import http from './http'

export const apiAccountAdminList = (params) => http.get('/api/accounts', { params })

export const apiAccountAdminDetail = (id) => http.get(`/api/accounts/${id}`)

export const apiAccountAdminUpdate = (id, body) => http.put(`/api/accounts/${id}`, body)

export const apiAccountAdminResetPassword = (id, body) => http.post(`/api/accounts/${id}/reset-password`, body)
