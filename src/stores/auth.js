import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { apiLogin, apiMe } from '~/api/auth'
import { TOKEN_KEY } from '~/constants/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || '')
  const me = ref(null)
  const permSet = ref(new Set())

  const isAuthed = computed(() => Boolean(token.value))

  const setToken = (t) => {
    token.value = t || ''
    if (token.value) localStorage.setItem(TOKEN_KEY, token.value)
    else localStorage.removeItem(TOKEN_KEY)
  }

  const hasPerm = (permCode) => {
    if (!permCode) return true
    if (me.value?.isAdmin) return true
    return permSet.value.has(permCode)
  }

  const bootstrap = async () => {
    if (!token.value) return false
    const data = await apiMe()
    me.value = data
    permSet.value = new Set(data?.permCodes || [])
    return true
  }

  const login = async (username, password) => {
    const data = await apiLogin({ username, password })
    setToken(data?.token)
    await bootstrap()
  }

  const logout = async () => {
    setToken('')
    me.value = null
    permSet.value = new Set()
  }

  return {
    token,
    me,
    permSet,
    isAuthed,
    setToken,
    hasPerm,
    bootstrap,
    login,
    logout
  }
})
