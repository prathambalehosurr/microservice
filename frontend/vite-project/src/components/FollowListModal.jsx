import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiX } from 'react-icons/fi'
import Avatar from './Avatar'
import Spinner from './Spinner'
import { getFollowers, getFollowing } from '../api/users'
import './FollowListModal.css'

export default function FollowListModal({ username, type, onClose }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const title = type === 'followers' ? 'Followers' : 'Following'

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const fetcher = type === 'followers' ? getFollowers : getFollowing
        const data = await fetcher(username)
        if (active) setUsers(data)
      } catch {
        /* ignore */
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [username, type])

  return (
    <div className="follow-modal-overlay" onClick={onClose}>
      <div className="follow-modal" onClick={(e) => e.stopPropagation()}>
        <div className="follow-modal__header">
          <span className="follow-modal__title">{title}</span>
          <button className="follow-modal__close" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        <div className="follow-modal__list">
          {loading ? (
            <div className="follow-modal__loading">
              <Spinner />
            </div>
          ) : users.length === 0 ? (
            <div className="follow-modal__empty">
              {type === 'followers' ? 'No followers yet.' : 'Not following anyone yet.'}
            </div>
          ) : (
            users.map((u) => (
              <Link
                to={`/${u.username}`}
                className="follow-modal__item"
                key={u.id}
                onClick={onClose}
              >
                <Avatar src={u.avatar_url} username={u.username} size={44} />
                <div className="follow-modal__info">
                  <span className="follow-modal__username">{u.username}</span>
                  {u.full_name && (
                    <span className="follow-modal__fullname">{u.full_name}</span>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
