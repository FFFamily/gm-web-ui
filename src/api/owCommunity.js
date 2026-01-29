import httpPublic from './httpPublic'
import httpAccount from './httpAccount'

// Public
export function owCommunityListLoadouts(params) {
  return httpPublic.get('/api/ow/community/loadouts', { params })
}

export function owCommunityGetLoadout(id) {
  return httpPublic.get(`/api/ow/community/loadouts/${id}`)
}

export function owCommunityHeroStats() {
  return httpPublic.get('/api/ow/community/heroes')
}

// Account required
export function owCommunityCreateLoadout(body) {
  return httpAccount.post('/api/ow/community/loadouts', body)
}

export function owCommunityLike(id) {
  return httpAccount.put(`/api/ow/community/loadouts/${id}/like`)
}

export function owCommunityUnlike(id) {
  return httpAccount.delete(`/api/ow/community/loadouts/${id}/like`)
}

export function owCommunityFavorite(id) {
  return httpAccount.put(`/api/ow/community/loadouts/${id}/favorite`)
}

export function owCommunityUnfavorite(id) {
  return httpAccount.delete(`/api/ow/community/loadouts/${id}/favorite`)
}

export function owCommunityMyState(id) {
  return httpAccount.get(`/api/ow/community/loadouts/${id}/my-state`, { meta: { silenceError: true } })
}
