import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiX } from 'react-icons/fi'
import { FaRegHeart, FaHeart, FaRegComment } from 'react-icons/fa'
import Avatar from './Avatar'
import { likePost, unlikePost, addComment, getComments } from '../api/posts'
import { timeAgo, formatCount } from '../utils'
import './PostDetailModal.css'

export default function PostDetailModal({ post: initialPost, onClose }) {
  const [liked, setLiked] = useState(initialPost.liked)
  const [likeCount, setLikeCount] = useState(initialPost.like_count)
  const [comments, setComments] = useState([])
  const [commentCount, setCommentCount] = useState(initialPost.comment_count)
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  // Load all comments on mount
  useEffect(() => {
    let active = true
    async function loadComments() {
      try {
        const all = await getComments(initialPost.id)
        if (active) {
          setComments(all)
          setCommentCount(all.length)
        }
      } catch {
        /* ignore */
      }
    }
    loadComments()
    return () => {
      active = false
    }
  }, [initialPost.id])

  // Keyboard: Escape to close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const toggleLike = async () => {
    const next = !liked
    setLiked(next)
    setLikeCount((c) => c + (next ? 1 : -1))
    try {
      next ? await likePost(initialPost.id) : await unlikePost(initialPost.id)
    } catch {
      setLiked(!next)
      setLikeCount((c) => c + (next ? -1 : 1))
    }
  }

  const submitComment = async (e) => {
    e.preventDefault()
    const value = text.trim()
    if (!value || posting) return
    setPosting(true)
    setError('')
    try {
      const created = await addComment(initialPost.id, value)
      setComments((prev) => [...prev, created])
      setCommentCount((c) => c + 1)
      setText('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not post comment.')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="post-detail-overlay" onClick={onClose}>
      <button className="modal-close" onClick={onClose} aria-label="Close">
        <FiX />
      </button>
      <div className="post-detail" onClick={(e) => e.stopPropagation()}>
        {/* Left: image */}
        <div className="post-detail__media">
          <img src={initialPost.image_url} alt={initialPost.caption || 'post'} />
        </div>

        {/* Right: sidebar */}
        <div className="post-detail__sidebar">
          <div className="post-detail__head">
            <Link
              to={`/${initialPost.owner.username}`}
              className="post-detail__author"
              onClick={onClose}
            >
              <Avatar
                src={initialPost.owner.avatar_url}
                username={initialPost.owner.username}
                size={32}
              />
              <span className="post-detail__author-name">
                {initialPost.owner.username}
              </span>
            </Link>
          </div>

          <div className="post-detail__body">
            {initialPost.caption && (
              <div className="post-detail__caption">
                <strong>{initialPost.owner.username}</strong>
                {initialPost.caption}
              </div>
            )}
            {comments.map((c) => (
              <div className="post-detail__comment" key={c.id}>
                <strong>
                  <Link to={`/${c.owner.username}`} onClick={onClose}>
                    {c.owner.username}
                  </Link>
                </strong>
                {c.text}
                <div className="post-detail__comment-time">{timeAgo(c.created_at)}</div>
              </div>
            ))}
          </div>

          <div className="post-detail__actions">
            <button onClick={toggleLike} aria-label="Like" className={liked ? 'liked' : ''}>
              {liked ? <FaHeart /> : <FaRegHeart />}
            </button>
            <button onClick={() => inputRef.current?.focus()} aria-label="Comment">
              <FaRegComment />
            </button>
          </div>

          {likeCount > 0 && (
            <div className="post-detail__likes">
              {formatCount(likeCount)} {likeCount === 1 ? 'like' : 'likes'}
            </div>
          )}

          <div className="post-detail__timestamp">
            {timeAgo(initialPost.created_at)} ago
          </div>

          {error && <div className="post-detail__error">{error}</div>}

          <form className="post-detail__add" onSubmit={submitComment}>
            <input
              ref={inputRef}
              placeholder="Add a comment…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {text.trim() && (
              <button type="submit" className="link-blue" disabled={posting}>
                Post
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
