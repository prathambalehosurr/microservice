import { RiMessengerLine } from 'react-icons/ri'
import { FaRegHeart } from 'react-icons/fa'

const ICONS = {
  Messages: <RiMessengerLine />,
  Notifications: <FaRegHeart />,
}

export default function Placeholder({ title }) {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        color: 'var(--ig-text-secondary)',
        textAlign: 'center',
        padding: 20,
      }}
    >
      <div style={{ fontSize: 56, color: 'var(--ig-text)' }}>{ICONS[title]}</div>
      <h2 style={{ color: 'var(--ig-text)', fontWeight: 600 }}>{title}</h2>
      <p>This feature isn't built yet — coming soon.</p>
    </div>
  )
}
