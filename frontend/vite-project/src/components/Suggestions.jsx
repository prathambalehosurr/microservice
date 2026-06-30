import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import { useAuth } from '../context/AuthContext'
import './Suggestions.css'

const FOOTER_LINKS = [
  'About',
  'Help',
  'Press',
  'API',
  'Jobs',
  'Privacy',
  'Terms',
  'Locations',
  'Language',
]

export default function Suggestions({ people = [] }) {
  const { user, logout } = useAuth()

  return (
    <aside className="suggest">
      <div className="suggest__me">
        <Link to={`/${user?.username}`}>
          <Avatar src={user?.avatar_url} username={user?.username} size={44} />
        </Link>
        <div className="suggest__me-info">
          <Link to={`/${user?.username}`} className="suggest__me-name">
            {user?.username}
          </Link>
          <span className="suggest__me-full">{user?.full_name}</span>
        </div>
        <button className="link-blue suggest__switch" onClick={logout}>
          Switch
        </button>
      </div>

      <div className="suggest__head">
        <span>Suggestions for you</span>
        <Link to="/explore" className="suggest__seeall">
          See All
        </Link>
      </div>

      <ul className="suggest__list">
        {people.length === 0 && (
          <li className="suggest__empty">Follow people to see their stories &amp; posts here.</li>
        )}
        {people.map((p) => (
          <li className="suggest__row" key={p.id}>
            <Link to={`/${p.username}`}>
              <Avatar src={p.avatar_url} username={p.username} size={36} />
            </Link>
            <div className="suggest__row-info">
              <Link to={`/${p.username}`} className="suggest__row-name">
                {p.username}
              </Link>
              <span className="suggest__row-meta">{p.full_name || 'Suggested for you'}</span>
            </div>
            <Link to={`/${p.username}`} className="link-blue suggest__follow">
              View
            </Link>
          </li>
        ))}
      </ul>

      <nav className="suggest__footer">
        {FOOTER_LINKS.map((l) => (
          <span key={l}>{l} · </span>
        ))}
        <div className="suggest__copy">© {new Date().getFullYear()} INSTAGRAM CLONE</div>
      </nav>
    </aside>
  )
}
