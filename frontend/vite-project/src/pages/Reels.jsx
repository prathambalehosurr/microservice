import { useEffect, useRef, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaCommentDots } from 'react-icons/fa'
import { FiSend } from 'react-icons/fi'
import { BsBookmark, BsThreeDots } from 'react-icons/bs'
import { HiOutlineSparkles } from 'react-icons/hi'
import { BsPlayFill, BsEye } from 'react-icons/bs'
import {
  getRecommendedReels,
  likeReel,
  unlikeReel,
  recordReelView,
} from '../api/reels'
import Avatar from '../components/Avatar'
import Spinner from '../components/Spinner'
import { formatCount } from '../utils'
import './Reels.css'

function ReelCard({ reel }) {
  const videoRef = useRef(null)
  const viewedRef = useRef(false)
  const [liked, setLiked] = useState(reel.liked)
  const [likeCount, setLikeCount] = useState(reel.like_count)

  // Autoplay when in view; record a view (once) as an implicit-feedback signal.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
          if (!viewedRef.current) {
            viewedRef.current = true
            recordReelView(reel.id).catch(() => {})
          }
        } else {
          video.pause()
        }
      },
      { threshold: 0.6 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [reel.id])

  const toggleLike = async () => {
    const next = !liked
    setLiked(next)
    setLikeCount((c) => c + (next ? 1 : -1))
    try {
      next ? await likeReel(reel.id) : await unlikeReel(reel.id)
    } catch {
      setLiked(!next)
      setLikeCount((c) => c + (next ? -1 : 1))
    }
  }

  return (
    <div className="reel">
      <div className="reel__video-wrap">
        <video
          ref={videoRef}
          src={reel.video_url}
          poster={reel.thumbnail_url || undefined}
          loop
          muted
          playsInline
          onClick={(e) => (e.target.paused ? e.target.play() : e.target.pause())}
        />

        {reel.reason && (
          <div className="reel__reason">
            <HiOutlineSparkles /> {reel.reason}
          </div>
        )}

        <div className="reel__overlay">
          <Link to={`/${reel.owner.username}`} className="reel__author">
            <Avatar src={reel.owner.avatar_url} username={reel.owner.username} size={32} />
            <span>{reel.owner.username}</span>
          </Link>
          {reel.caption && <p className="reel__caption">{reel.caption}</p>}
          <div className="reel__stats">
            <span>
              <BsPlayFill /> {formatCount(reel.view_count)} plays
            </span>
          </div>
        </div>
      </div>

      <div className="reel__actions">
        <button onClick={toggleLike} aria-label="Like" className={liked ? 'liked' : ''}>
          {liked ? <FaHeart /> : <FaRegHeart />}
        </button>
        <span className="reel__count">{formatCount(likeCount)}</span>
        <button aria-label="Comment">
          <FaCommentDots />
        </button>
        <button aria-label="Share">
          <FiSend />
        </button>
        <button aria-label="Save">
          <BsBookmark />
        </button>
        <button aria-label="More">
          <BsThreeDots />
        </button>
      </div>
    </div>
  )
}

export default function Reels() {
  const { openCreate } = useOutletContext()
  const [reels, setReels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getRecommendedReels({ limit: 30 })
      .then((data) => active && setReels(data))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  if (loading) return <Spinner page />

  if (reels.length === 0) {
    return (
      <div className="reels reels--empty">
        <h2>No reels to suggest yet</h2>
        <p>
          <button className="link-blue" onClick={openCreate}>
            Upload a reel
          </button>{' '}
          or follow people to personalize your feed.
        </p>
      </div>
    )
  }

  return (
    <div className="reels">
      {reels.map((reel) => (
        <ReelCard key={reel.id} reel={reel} />
      ))}
    </div>
  )
}
