import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaRegHeart, FaHeart, FaRegComment } from 'react-icons/fa'
import { FiSend, FiMoreHorizontal } from 'react-icons/fi'
import { BsBookmark } from 'react-icons/bs'
import Avatar from './Avatar'
import { likePost, unlikePost, addComment, getComments } from '../api/posts'
import { timeAgo, formatCount } from '../utils'
import './Post.css'

export default function Post({ post }) {
  const [liked, setLiked] = useState(post.liked)
  const [likeCount, setLikeCount] = useState(post.like_count)
  const [comments, setComments] = useState([])
  const [commentCount, setCommentCount] = useState(post.comment_count)
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(false)
  const inputRef = useRef(null)

  const toggleLike = async () => {
    const next = !liked
    setLiked(next)
    setLikeCount((c) => c + (next ? 1 : -1))
    try {
      next ? await likePost(post.id) : await unlikePost(post.id)
    } catch {
      // revert on failure
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
      const created = await addComment(post.id, value)
      setComments((prev) => [...prev, created])
      setCommentCount((c) => c + 1)
      setText('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not post comment.')
    } finally {
      setPosting(false)
    }
  }

  const loadAllComments = async () => {
    try {
      const all = await getComments(post.id)
      setComments(all)
      setCommentCount(all.length)
      setExpanded(true)
    } catch {
      /* ignore */
    }
  }

  const focusComment = () => inputRef.current?.focus()

  return (
    <article className="post">
      <header className="post__head">
        <Link to={`/${post.owner.username}`} className="post__author">
          <Avatar src={post.owner.avatar_url} username={post.owner.username} size={32} ring />
          <span className="post__username">{post.owner.username}</span>
        </Link>
        <span className="post__dot">·</span>
        <time className="post__time">{timeAgo(post.created_at)}</time>
        <button className="post__more" aria-label="More options">
          <FiMoreHorizontal />
        </button>
      </header>

      <div className="post__media" onDoubleClick={() => !liked && toggleLike()}>
        <img src={post.image_url} alt={post.caption || 'post'} />
      </div>

      <div className="post__actions">
        <div className="post__actions-left">
          <button onClick={toggleLike} aria-label="Like" className={liked ? 'liked' : ''}>
            {liked ? <FaHeart /> : <FaRegHeart />}
          </button>
          <button aria-label="Comment" onClick={focusComment}>
            <FaRegComment />
          </button>
          <button aria-label="Share">
            <FiSend />
          </button>
        </div>
        <button className="post__save" aria-label="Save">
          <BsBookmark />
        </button>
      </div>

      {likeCount > 0 && (
        <div className="post__likes">{formatCount(likeCount)} {likeCount === 1 ? 'like' : 'likes'}</div>
      )}

      {post.caption && (
        <div className="post__caption">
          <Link to={`/${post.owner.username}`} className="post__username">
            {post.owner.username}
          </Link>{' '}
          {post.caption}
        </div>
      )}

      {commentCount > 0 && (
        <div className="post__comments">
          {comments.map((c) => (
            <div key={c.id} className="post__comment">
              <Link to={`/${c.owner.username}`} className="post__username">
                {c.owner.username}
              </Link>{' '}
              {c.text}
            </div>
          ))}
          {commentCount > comments.length && !expanded && (
            <div className="post__view-comments" onClick={loadAllComments}>
              View all {formatCount(commentCount)} comments
            </div>
          )}
        </div>
      )}

      <time className="post__timestamp">{timeAgo(post.created_at)} ago</time>

      {error && <div className="post__error">{error}</div>}

      <form className="post__add" onSubmit={submitComment}>
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
    </article>
  )
}
