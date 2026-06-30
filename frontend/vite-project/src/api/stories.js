import api from './client'

// Returns [{ user, stories: [...] }] — active stories grouped by author.
export async function getStoryTray() {
  const { data } = await api.get('/stories')
  return data
}

export async function createStory(file) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post('/stories', form)
  return data
}
