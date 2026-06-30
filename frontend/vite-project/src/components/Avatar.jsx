import { avatarColor } from '../utils'

export default function Avatar({ src, username = '', size = 32, ring = false, seen = false }) {
  const initial = (username[0] || '?').toUpperCase()

  const img = src ? (
    <img
      src={src}
      alt={username}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}
    />
  ) : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: avatarColor(username),
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: size * 0.42,
        userSelect: 'none',
      }}
    >
      {initial}
    </div>
  )

  if (!ring) return img

  return (
    <div className={`story-ring ${seen ? 'story-ring--seen' : ''}`}>
      <div className="story-ring__inner">{img}</div>
    </div>
  )
}
