import { useState } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { getProfile } from '../api/users'
import Avatar from './Avatar'
import './SearchPanel.css'

// The backend has no fuzzy search endpoint, so this resolves an exact username
// via GET /users/{username} and lets you jump to that profile.
export default function SearchPanel({ onClose, onGo }) {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | notfound

  const handleChange = async (value) => {
    setQuery(value)
    setResult(null)
    const username = value.trim()
    if (!username) {
      setStatus('idle')
      return
    }
    setStatus('loading')
    try {
      const profile = await getProfile(username)
      setResult(profile)
      setStatus('done')
    } catch {
      setStatus('notfound')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="search" onClick={(e) => e.stopPropagation()}>
        <h2 className="search__title">Search</h2>
        <div className="search__box">
          <FiSearch className="search__icon" />
          <input
            autoFocus
            placeholder="Search by exact username"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
          />
          {query && (
            <button onClick={() => handleChange('')} aria-label="Clear">
              <FiX />
            </button>
          )}
        </div>

        <div className="search__results">
          {status === 'loading' && <p className="search__hint">Searching…</p>}
          {status === 'notfound' && <p className="search__hint">No user found.</p>}
          {status === 'done' && result && (
            <button className="search__row" onClick={() => onGo(result.username)}>
              <Avatar src={result.avatar_url} username={result.username} size={44} />
              <span>
                <strong>{result.username}</strong>
                <small>{result.full_name}</small>
              </span>
            </button>
          )}
          {status === 'idle' && <p className="search__hint">Type a username to begin.</p>}
        </div>
      </div>
    </div>
  )
}
