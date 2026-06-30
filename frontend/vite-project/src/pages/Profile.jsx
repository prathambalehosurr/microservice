import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaRegHeart, FaComment } from 'react-icons/fa'
import { BiMoviePlay } from 'react-icons/bi'
import { BsGrid3X3, BsCameraReels, BsBookmark } from 'react-icons/bs'
import { getProfile, getUserPosts, followUser, unfollowUser } from '../api/users'
import { getUserReels } from '../api/reels'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/Avatar'
import Spinner from '../components/Spinner'
import EditProfileModal from '../components/EditProfileModal'
import FollowListModal from '../components/FollowListModal'
import PostDetailModal from '../components/PostDetailModal'
import { formatCount } from '../utils'
import './Profile.css'

export default function Profile() {
  const { username } = useParams()
  const { user: me, refreshUser } = useAuth()

  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [reels, setReels] = useState([])
  const [tab, setTab] = useState('posts')
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [editing, setEditing] = useState(false)
  const [followBusy, setFollowBusy] = useState(false)
  const [followModal, setFollowModal] = useState(null) // 'followers' | 'following' | null
  const [selectedPost, setSelectedPost] = useState(null)

  const isMe = me?.username === username

  useEffect(() => {
    let active = true
    setLoading(true)
    setNotFound(false)
    setTab('posts')
    async function load() {
      try {
        const p = await getProfile(username)
        if (!active) return
        setProfile(p)
        const [postList, reelList] = await Promise.all([
          getUserPosts(username).catch(() => []),
          getUserReels(username).catch(() => []),
        ])
        if (!active) return
        setPosts(postList)
        setReels(reelList)
      } catch {
        if (active) setNotFound(true)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [username])

  const toggleFollow = async () => {
    if (followBusy || !profile) return
    setFollowBusy(true)
    const wasFollowing = profile.is_following
    setProfile((p) => ({
      ...p,
      is_following: !wasFollowing,
      follower_count: p.follower_count + (wasFollowing ? -1 : 1),
    }))
    try {
      wasFollowing ? await unfollowUser(profile.id) : await followUser(profile.id)
    } catch {
      setProfile((p) => ({
        ...p,
        is_following: wasFollowing,
        follower_count: p.follower_count + (wasFollowing ? 1 : -1),
      }))
    } finally {
      setFollowBusy(false)
    }
  }

  const onProfileSaved = async (updated) => {
    setProfile((p) => ({ ...p, ...updated }))
    await refreshUser()
    setEditing(false)
  }

  if (loading) return <Spinner page />
  if (notFound)
    return (
      <div className="profile profile--missing">
        <h2>Sorry, this page isn't available.</h2>
        <p>The link you followed may be broken, or the page may have been removed.</p>
        <Link to="/" className="link-blue">
          Go back to Instagram.
        </Link>
      </div>
    )

  const items = tab === 'reels' ? reels : posts

  return (
    <div className="profile">
      <header className="profile__head">
        <div className="profile__avatar">
          <Avatar src={profile.avatar_url} username={profile.username} size={150} />
        </div>

        <div className="profile__info">
          <div className="profile__top">
            <h1 className="profile__username">{profile.username}</h1>
            {isMe ? (
              <button className="btn-secondary" onClick={() => setEditing(true)}>
                Edit profile
              </button>
            ) : (
              <button
                className={profile.is_following ? 'btn-secondary' : 'btn-primary'}
                onClick={toggleFollow}
                disabled={followBusy}
              >
                {profile.is_following ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          <ul className="profile__stats">
            <li>
              <strong>{formatCount(profile.post_count)}</strong> posts
            </li>
            <li>
              <button
                className="profile__stat-btn"
                onClick={() => setFollowModal('followers')}
              >
                <strong>{formatCount(profile.follower_count)}</strong> followers
              </button>
            </li>
            <li>
              <button
                className="profile__stat-btn"
                onClick={() => setFollowModal('following')}
              >
                <strong>{formatCount(profile.following_count)}</strong> following
              </button>
            </li>
          </ul>

          <div className="profile__bio">
            {profile.full_name && <div className="profile__fullname">{profile.full_name}</div>}
            {profile.bio && <div>{profile.bio}</div>}
          </div>
        </div>
      </header>

      <nav className="profile__tabs">
        <button
          className={tab === 'posts' ? 'active' : ''}
          onClick={() => setTab('posts')}
        >
          <BsGrid3X3 /> POSTS
        </button>
        <button
          className={tab === 'reels' ? 'active' : ''}
          onClick={() => setTab('reels')}
        >
          <BsCameraReels /> REELS
        </button>
        <button className={tab === 'saved' ? 'active' : ''} onClick={() => setTab('saved')}>
          <BsBookmark /> SAVED
        </button>
      </nav>

      {tab === 'saved' ? (
        <div className="profile__empty">
          <p>Only you can see what you've saved.</p>
        </div>
      ) : items.length === 0 ? (
        <div className="profile__empty">
          <p>No {tab} yet.</p>
        </div>
      ) : (
        <div className="grid">
          {items.map((item) =>
            tab === 'reels' ? (
              <Link to="/reels" className="grid__item" key={`r${item.id}`}>
                {item.thumbnail_url ? (
                  <img src={item.thumbnail_url} alt={item.caption || 'reel'} />
                ) : (
                  <video src={item.video_url} muted />
                )}
                <div className="grid__overlay">
                  <span>
                    <BiMoviePlay /> Reel
                  </span>
                </div>
              </Link>
            ) : (
              <div
                className="grid__item"
                key={`p${item.id}`}
                onClick={() => setSelectedPost(item)}
              >
                <img src={item.image_url} alt={item.caption || 'post'} />
                <div className="grid__overlay">
                  <span>
                    <FaRegHeart /> {formatCount(item.like_count)}
                  </span>
                  <span>
                    <FaComment /> {formatCount(item.comment_count)}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {editing && (
        <EditProfileModal
          profile={profile}
          onClose={() => setEditing(false)}
          onSaved={onProfileSaved}
        />
      )}

      {followModal && (
        <FollowListModal
          username={username}
          type={followModal}
          onClose={() => setFollowModal(null)}
        />
      )}

      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  )
}
