import http from './http'

export const apiAuditList = (params) => http.get('/api/audits', { params })

