import httpAccount from './httpAccount'

export const apiAccountLogin = (body) =>
  httpAccount.post('/api/account/login', body, { meta: { silenceError: true } })

export const apiAccountRegister = (body) =>
  httpAccount.post('/api/account/register', body, { meta: { silenceError: true } })

export const apiAccountMe = () => httpAccount.get('/api/account/me')

export const apiAccountUpdateMe = (body) => httpAccount.put('/api/account/me', body)

export const apiAccountLogout = () => httpAccount.post('/api/account/logout')
