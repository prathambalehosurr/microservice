import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BiMoviePlay } from 'react-icons/bi'
import { getReels } from '../api/reels'
import Spinner from '../components/Spinner'
import './Explore.css'

export default function Explore() {
  const [reels, setReels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getReels({ limit: 30 })
      .then((data) => active && setReels(data))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  if (loading) return <Spinner page />

  return (
    <div className="explore">
      {reels.length === 0 ? (
        <div className="explore__empty">Nothing to explore yet.</div>
      ) : (
        <div className="explore__grid">
          {reels.map((reel) => (
            <Link to="/reels" className="explore__item" key={reel.id}>
              {reel.thumbnail_url ? (
                <img src={reel.thumbnail_url} alt={reel.caption || 'reel'} />
              ) : (
                <video src={reel.video_url} muted />
              )}
              <BiMoviePlay className="explore__badge" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
