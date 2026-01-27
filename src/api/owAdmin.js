import http from './http'

// Heroes
export function adminListOwHeroes(params) {
  return http.get('/api/admin/ow/heroes', { params })
}

export function adminGetOwHero(id) {
  return http.get(`/api/admin/ow/heroes/${id}`)
}

export function adminCreateOwHero(body) {
  return http.post('/api/admin/ow/heroes', body)
}

export function adminUpdateOwHero(id, body) {
  return http.put(`/api/admin/ow/heroes/${id}`, body)
}

export function adminDeleteOwHero(id) {
  return http.delete(`/api/admin/ow/heroes/${id}`)
}

// Items
export function adminListOwItems(params) {
  return http.get('/api/admin/ow/items', { params })
}

export function adminGetOwItem(id) {
  return http.get(`/api/admin/ow/items/${id}`)
}

export function adminCreateOwItem(body) {
  return http.post('/api/admin/ow/items', body)
}

export function adminUpdateOwItem(id, body) {
  return http.put(`/api/admin/ow/items/${id}`, body)
}

export function adminDeleteOwItem(id) {
  return http.delete(`/api/admin/ow/items/${id}`)
}

export function adminBindOwItemHeroes(id, body) {
  return http.post(`/api/admin/ow/items/${id}/heroes`, body)
}

