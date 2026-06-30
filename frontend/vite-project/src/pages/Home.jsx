import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { BiMoviePlay } from 'react-icons/bi'
import { getFeed } from '../api/posts'
import { getStoryTray } from '../api/stories'
import { getRecommendedReels } from '../api/reels'
import StoriesTray from '../components/StoriesTray'
import Post from '../components/Post'
import Suggestions from '../components/Suggestions'
import Spinner from '../components/Spinner'
import './Home.css'

export default function Home() {
  const { openCreate } = useOutletContext()
  const [posts, setPosts] = useState([])
  const [trays, setTrays] = useState([])
  const [reels, setReels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const [feed, storyTrays, reelList] = await Promise.all([
          getFeed(),
          getStoryTray().catch(() => []),
          getRecommendedReels({ limit: 12 }).catch(() => []),
        ])
        if (!active) return
        setPosts(feed)
        setTrays(storyTrays)
        setReels(reelList)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  if (loading) return <Spinner page />

  const suggestionPeople = trays.map((t) => t.user)

  return (
    <div className="home">
      <div className="home__feed">
        <StoriesTray trays={trays} onAddStory={openCreate} />

        {reels.length > 0 && (
          <section className="home-reels">
            <div className="home-reels__head">
              <BiMoviePlay /> <span>Reels</span>
              <Link to="/reels" className="home-reels__more">
                See all
              </Link>
            </div>
            <div className="home-reels__scroller">
              {reels.map((reel) => (
                <Link to="/reels" className="home-reels__item" key={reel.id}>
                  {reel.thumbnail_url ? (
                    <img src={reel.thumbnail_url} alt={reel.caption || 'reel'} />
                  ) : (
                    <video src={reel.video_url} muted />
                  )}
                  <span className="home-reels__user">@{reel.owner.username}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {posts.length === 0 ? (
          <div className="home__empty">
            <h2>Welcome to Instagram</h2>
            <p>
              Follow people or{' '}
              <button className="link-blue" onClick={openCreate}>
                create your first post
              </button>{' '}
              to fill your feed.
            </p>
          </div>
        ) : (
          posts.map((post) => <Post key={post.id} post={post} />)
        )}
      </div>

      <div className="home__aside">
        <Suggestions people={suggestionPeople} />
      </div>
    </div>
  )
}
