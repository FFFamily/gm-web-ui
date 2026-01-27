import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { apiAccountLogin, apiAccountLogout, apiAccountMe, apiAccountRegister, apiAccountUpdateMe } from '~/api/account'
import { ACCOUNT_TOKEN_KEY } from '~/constants/accountAuth'

export const useAccountAuthStore = defineStore('accountAuth', () => {
  const token = ref(localStorage.getItem(ACCOUNT_TOKEN_KEY) || '')
  const me = ref(null)

  const isAuthed = computed(() => Boolean(token.value))

  const setToken = (t) => {
    token.value = t || ''
    if (token.value) localStorage.setItem(ACCOUNT_TOKEN_KEY, token.value)
    else localStorage.removeItem(ACCOUNT_TOKEN_KEY)
  }

  const bootstrap = async () => {
    if (!token.value) return false
    me.value = await apiAccountMe()
    return true
  }

  const login = async (username, password) => {
    const data = await apiAccountLogin({ username, password })
    setToken(data?.token)
    await bootstrap()
  }

  const register = async ({ username, password, displayName }) => {
    const data = await apiAccountRegister({ username, password, displayName })
    setToken(data?.token)
    await bootstrap()
  }

  const logout = async () => {
    try {
      if (token.value) await apiAccountLogout()
    } finally {
      setToken('')
      me.value = null
    }
  }

  const updateProfile = async (payload) => {
    const data = await apiAccountUpdateMe(payload)
    me.value = data
    return data
  }

  return { token, me, isAuthed, setToken, bootstrap, login, register, logout, updateProfile }
})
