import httpPublic from './httpPublic'

export function getOwBaseInfo() {
  return httpPublic.get('/api/ow/base-info')
}

export function listOwHeroes() {
  return httpPublic.get('/api/ow/heroes')
}

export function getOwHeroDetail(heroCode) {
  return httpPublic.get(`/api/ow/heroes/${encodeURIComponent(heroCode)}`)
}

export function listOwItems({ heroCode, category, quality }) {
  return httpPublic.get('/api/ow/items', {
    params: { heroCode, category, quality }
  })
}

