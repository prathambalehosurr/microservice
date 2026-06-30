import api from './client'

export async function getFeed({ skip = 0, limit = 20 } = {}) {
  const { data } = await api.get('/posts/feed', { params: { skip, limit } })
  return data
}

export async function getPost(postId) {
  const { data } = await api.get(`/posts/${postId}`)
  return data
}

export async function createPost(file, caption) {
  const form = new FormData()
  form.append('file', file)
  if (caption) form.append('caption', caption)
  const { data } = await api.post('/posts', form)
  return data
}

export async function deletePost(postId) {
  await api.delete(`/posts/${postId}`)
}

export async function likePost(postId) {
  await api.post(`/posts/${postId}/like`)
}

export async function unlikePost(postId) {
  await api.delete(`/posts/${postId}/like`)
}

export async function getComments(postId, { skip = 0, limit = 50 } = {}) {
  const { data } = await api.get(`/posts/${postId}/comments`, {
    params: { skip, limit },
  })
  return data
}

export async function addComment(postId, text) {
  const { data } = await api.post(`/posts/${postId}/comments`, { text })
  return data
}
