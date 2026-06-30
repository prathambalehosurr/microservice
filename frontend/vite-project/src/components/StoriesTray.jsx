import { useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi'
import Avatar from './Avatar'
import StoryViewer from './StoryViewer'
import { useAuth } from '../context/AuthContext'
import './StoriesTray.css'

export default function StoriesTray({ trays = [], onAddStory }) {
  const { user } = useAuth()
  const scrollerRef = useRef(null)
  const [viewerTrayIdx, setViewerTrayIdx] = useState(null)

  const scroll = (dir) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  // Don't show your own tray twice in the list.
  const others = trays.filter((t) => t.user.username !== user?.username)

  const openViewer = (trayIndex) => {
    setViewerTrayIdx(trayIndex)
  }

  return (
    <div className="stories">
      <button className="stories__nav stories__nav--left" onClick={() => scroll(-1)}>
        <FiChevronLeft />
      </button>

      <div className="stories__scroller" ref={scrollerRef}>
        {/* Your story / add */}
        <button className="story" onClick={onAddStory}>
          <div className="story__add-ring">
            <Avatar src={user?.avatar_url} username={user?.username} size={56} />
            <span className="story__add-badge">
              <FiPlus />
            </span>
          </div>
          <span className="story__name">Your story</span>
        </button>

        {others.map((tray, idx) => (
          <button
            className="story"
            key={tray.user.id}
            onClick={() => openViewer(idx)}
          >
            <Avatar src={tray.user.avatar_url} username={tray.user.username} size={56} ring />
            <span className="story__name">{tray.user.username}</span>
          </button>
        ))}
      </div>

      <button className="stories__nav stories__nav--right" onClick={() => scroll(1)}>
        <FiChevronRight />
      </button>

      {viewerTrayIdx !== null && (
        <StoryViewer
          trays={others}
          initialTrayIndex={viewerTrayIdx}
          onClose={() => setViewerTrayIdx(null)}
        />
      )}
    </div>
  )
}
