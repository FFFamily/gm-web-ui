import http from './http'

export function apiFileList(params) {
  return http.get('/api/files', { params })
}

export function apiFileUpload({ biz, file, type }) {
  const fd = new FormData()
  fd.append('biz', biz)
  if (type) fd.append('type', type)
  fd.append('file', file)
  return http.post('/api/files/upload', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function apiFileDelete(id) {
  return http.delete(`/api/files/${id}`)
}

