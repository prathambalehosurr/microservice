import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Avatar from './Avatar'
import { timeAgo } from '../utils'
import './StoryViewer.css'

const STORY_DURATION = 5000 // 5 seconds per story (for images)

export default function StoryViewer({ trays, initialTrayIndex = 0, onClose }) {
  const [trayIdx, setTrayIdx] = useState(initialTrayIndex)
  const [storyIdx, setStoryIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef(null)
  const startTimeRef = useRef(null)
  const videoRef = useRef(null)

  const tray = trays[trayIdx]
  const story = tray?.stories?.[storyIdx]
  const isVideo = story?.media_type === 'video'

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Advance to next story or next tray
  const goNext = useCallback(() => {
    const currentTray = trays[trayIdx]
    if (storyIdx < currentTray.stories.length - 1) {
      setStoryIdx((i) => i + 1)
      setProgress(0)
    } else if (trayIdx < trays.length - 1) {
      setTrayIdx((i) => i + 1)
      setStoryIdx(0)
      setProgress(0)
    } else {
      onClose()
    }
  }, [trayIdx, storyIdx, trays, onClose])

  // Go to previous story or previous tray
  const goPrev = useCallback(() => {
    if (storyIdx > 0) {
      setStoryIdx((i) => i - 1)
      setProgress(0)
    } else if (trayIdx > 0) {
      setTrayIdx((i) => i - 1)
      const prevTray = trays[trayIdx - 1]
      setStoryIdx(prevTray.stories.length - 1)
      setProgress(0)
    }
  }, [trayIdx, storyIdx, trays])

  // Auto-advance timer for images
  useEffect(() => {
    if (!story || isVideo) return
    startTimeRef.current = Date.now()

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current
      const pct = Math.min(elapsed / STORY_DURATION, 1)
      setProgress(pct * 100)
      if (pct >= 1) {
        goNext()
      } else {
        timerRef.current = requestAnimationFrame(tick)
      }
    }
    timerRef.current = requestAnimationFrame(tick)

    return clearTimer
  }, [story, isVideo, goNext, clearTimer])

  // For videos, track progress via timeupdate
  useEffect(() => {
    if (!isVideo || !videoRef.current) return
    const vid = videoRef.current
    const onTimeUpdate = () => {
      if (vid.duration) {
        setProgress((vid.currentTime / vid.duration) * 100)
      }
    }
    const onEnded = () => goNext()
    vid.addEventListener('timeupdate', onTimeUpdate)
    vid.addEventListener('ended', onEnded)
    return () => {
      vid.removeEventListener('timeupdate', onTimeUpdate)
      vid.removeEventListener('ended', onEnded)
    }
  }, [isVideo, story, goNext])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight' || e.key === ' ') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, goNext, goPrev])

  if (!tray || !story) return null

  const stories = tray.stories

  return (
    <div className="story-viewer" onClick={onClose}>
      <button className="story-viewer__close" onClick={onClose} aria-label="Close">
        <FiX />
      </button>

      <div className="story-viewer__card" onClick={(e) => e.stopPropagation()}>
        {/* Progress bars */}
        <div className="story-viewer__progress">
          {stories.map((s, i) => (
            <div className="story-viewer__bar" key={s.id}>
              <div
                className="story-viewer__bar-fill"
                style={{
                  width:
                    i < storyIdx
                      ? '100%'
                      : i === storyIdx
                        ? `${progress}%`
                        : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Header with user info */}
        <div className="story-viewer__header">
          <Avatar src={tray.user.avatar_url} username={tray.user.username} size={32} />
          <Link
            to={`/${tray.user.username}`}
            className="story-viewer__username"
            onClick={onClose}
          >
            {tray.user.username}
          </Link>
          <span className="story-viewer__time">{timeAgo(story.created_at)}</span>
        </div>

        {/* Story media */}
        {isVideo ? (
          <video
            ref={videoRef}
            className="story-viewer__media"
            src={story.media_url}
            autoPlay
            playsInline
            muted={false}
          />
        ) : (
          <img className="story-viewer__media" src={story.media_url} alt="story" />
        )}

        {/* Navigation buttons */}
        {(trayIdx > 0 || storyIdx > 0) && (
          <button
            className="story-viewer__nav story-viewer__nav--prev"
            onClick={goPrev}
            aria-label="Previous"
          >
            <FiChevronLeft />
          </button>
        )}
        {(trayIdx < trays.length - 1 || storyIdx < stories.length - 1) && (
          <button
            className="story-viewer__nav story-viewer__nav--next"
            onClick={goNext}
            aria-label="Next"
          >
            <FiChevronRight />
          </button>
        )}

        {/* Invisible tap zones for mobile */}
        <div className="story-viewer__tap-left" onClick={goPrev} />
        <div className="story-viewer__tap-right" onClick={goNext} />
      </div>
    </div>
  )
}
