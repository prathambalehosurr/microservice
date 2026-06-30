import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  AiFillHome,
  AiOutlineHome,
} from 'react-icons/ai'
import {
  FiSearch,
  FiPlusSquare,
  FiMenu,
  FiLogOut,
} from 'react-icons/fi'
import { MdOutlineExplore, MdExplore } from 'react-icons/md'
import { BiMoviePlay, BiSolidMoviePlay } from 'react-icons/bi'
import { RiMessengerLine, RiMessengerFill } from 'react-icons/ri'
import { FaRegHeart, FaHeart } from 'react-icons/fa'
import Avatar from './Avatar'
import { useAuth } from '../context/AuthContext'
import './Sidebar.css'

function Item({ to, label, icon, activeIcon, end }) {
  return (
    <NavLink to={to} end={end} className="sb-item" title={label}>
      {({ isActive }) => (
        <>
          <span className="sb-icon">{isActive ? activeIcon : icon}</span>
          <span className={`sb-label ${isActive ? 'sb-label--active' : ''}`}>{label}</span>
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar({ onCreate, onSearch }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="sidebar">
      <NavLink to="/" className="sb-logo">
        <span className="logo-text sb-logo__full">Instagram</span>
        <span className="sb-logo__mark" aria-hidden>
          <img src="/instagram.svg" alt="" width="28" height="28" />
        </span>
      </NavLink>

      <div className="sb-nav">
        <Item to="/" end label="Home" icon={<AiOutlineHome />} activeIcon={<AiFillHome />} />

        <button className="sb-item" onClick={onSearch} title="Search">
          <span className="sb-icon">
            <FiSearch />
          </span>
          <span className="sb-label">Search</span>
        </button>

        <Item
          to="/explore"
          label="Explore"
          icon={<MdOutlineExplore />}
          activeIcon={<MdExplore />}
        />
        <Item
          to="/reels"
          label="Reels"
          icon={<BiMoviePlay />}
          activeIcon={<BiSolidMoviePlay />}
        />
        <Item
          to="/messages"
          label="Messages"
          icon={<RiMessengerLine />}
          activeIcon={<RiMessengerFill />}
        />
        <Item
          to="/notifications"
          label="Notifications"
          icon={<FaRegHeart />}
          activeIcon={<FaHeart />}
        />

        <button className="sb-item" onClick={onCreate} title="Create">
          <span className="sb-icon">
            <FiPlusSquare />
          </span>
          <span className="sb-label">Create</span>
        </button>

        <NavLink to={`/${user?.username}`} className="sb-item" title="Profile">
          {({ isActive }) => (
            <>
              <span className="sb-icon">
                <span className={isActive ? 'sb-avatar sb-avatar--active' : 'sb-avatar'}>
                  <Avatar src={user?.avatar_url} username={user?.username} size={24} />
                </span>
              </span>
              <span className={`sb-label ${isActive ? 'sb-label--active' : ''}`}>Profile</span>
            </>
          )}
        </NavLink>
      </div>

      <div className="sb-bottom">
        {menuOpen && (
          <div className="sb-menu">
            <button className="sb-menu__item" onClick={handleLogout}>
              <FiLogOut /> Log out
            </button>
          </div>
        )}
        <button className="sb-item" onClick={() => setMenuOpen((o) => !o)} title="More">
          <span className="sb-icon">
            <FiMenu />
          </span>
          <span className="sb-label">More</span>
        </button>
      </div>
    </nav>
  )
}
