import api from './client'

// Personalized suggestions from the recommendation engine.
export async function getRecommendedReels({ limit = 20 } = {}) {
  const { data } = await api.get('/reels/recommended', { params: { limit } })
  return data
}

export async function getReels({ skip = 0, limit = 20 } = {}) {
  const { data } = await api.get('/reels', { params: { skip, limit } })
  return data
}

export async function getUserReels(username, { skip = 0, limit = 30 } = {}) {
  const { data } = await api.get(`/reels/user/${username}`, {
    params: { skip, limit },
  })
  return data
}

export async function createReel(video, { thumbnail, caption } = {}) {
  const form = new FormData()
  form.append('video', video)
  if (thumbnail) form.append('thumbnail', thumbnail)
  if (caption) form.append('caption', caption)
  const { data } = await api.post('/reels', form)
  return data
}

export async function likeReel(reelId) {
  await api.post(`/reels/${reelId}/like`)
}

export async function unlikeReel(reelId) {
  await api.delete(`/reels/${reelId}/like`)
}

// Implicit-feedback signal for recommendations.
export async function recordReelView(reelId, watchMs = 0) {
  await api.post(`/reels/${reelId}/view`, null, { params: { watch_ms: watchMs } })
}
