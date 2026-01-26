import http from './http'

export const apiPermissionList = () => http.get('/api/permissions')

