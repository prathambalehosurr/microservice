// Relative time like Instagram: 5m, 3h, 2d, 4w
export function timeAgo(dateString) {
  const date = new Date(dateString)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return `${Math.max(seconds, 1)}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  const weeks = Math.floor(days / 7)
  if (weeks < 52) return `${weeks}w`
  return `${Math.floor(days / 365)}y`
}

// Deterministic placeholder avatar (initials on a colored circle) when none is set.
const AVATAR_COLORS = ['#0095f6', '#d62976', '#fa7e1e', '#962fbf', '#4f5bd5', '#00a884']

export function avatarColor(username = '') {
  let hash = 0
  for (let i = 0; i < username.length; i++) hash = username.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function formatCount(n) {
  if (n < 1000) return `${n}`
  if (n < 1_000_000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`
  return `${(n / 1_000_000).toFixed(1)}m`
}