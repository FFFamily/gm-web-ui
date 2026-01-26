import http from './http'

export const apiRoleList = (params) => http.get('/api/roles', { params })
export const apiRoleDetail = (id) => http.get(`/api/roles/${id}`)
export const apiRoleCreate = (body) => http.post('/api/roles', body)
export const apiRoleUpdate = (id, body) => http.put(`/api/roles/${id}`, body)
export const apiRoleDelete = (id) => http.delete(`/api/roles/${id}`)
export const apiRoleBindPermissions = (id, body) =>
  http.post(`/api/roles/${id}/permissions`, body)

