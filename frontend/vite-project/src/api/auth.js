import api, { setToken } from './client'

// OAuth2 password flow expects form-encoded body.
export async function login(usernameOrEmail, password) {
  const body = new URLSearchParams()
  body.append('username', usernameOrEmail)
  body.append('password', password)
  const { data } = await api.post('/auth/login', body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  setToken(data.access_token)
  return data
}

export async function signup({ username, email, password, full_name }) {
  const { data } = await api.post('/auth/signup', {
    username,
    email,
    password,
    full_name: full_name || null,
  })
  setToken(data.access_token)
  return data // { access_token, token_type, user }
}

export async function getMe() {
  const { data } = await api.get('/users/me')
  return data
}
