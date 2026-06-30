import api from './client'

export async function getProfile(username) {
  const { data } = await api.get(`/users/${username}`)
  return data
}

export async function getUserPosts(username, { skip = 0, limit = 30 } = {}) {
  const { data } = await api.get(`/users/${username}/posts`, {
    params: { skip, limit },
  })
  return data
}

export async function updateProfile({ full_name, bio }) {
  const { data } = await api.put('/users/me', { full_name, bio })
  return data
}

export async function uploadAvatar(file) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post('/users/me/avatar', form)
  return data
}

export async function getFollowers(username) {
  const { data } = await api.get(`/users/${username}/followers`)
  return data
}

export async function getFollowing(username) {
  const { data } = await api.get(`/users/${username}/following`)
  return data
}

export async function followUser(userId) {
  await api.post(`/users/${userId}/follow`)
}

export async function unfollowUser(userId) {
  await api.delete(`/users/${userId}/follow`)
}
