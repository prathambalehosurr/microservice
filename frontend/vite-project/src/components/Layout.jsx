import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import CreateModal from './CreateModal'
import SearchPanel from './SearchPanel'
import './Layout.css'

export default function Layout() {
  const [createOpen, setCreateOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="layout">
      <Sidebar onCreate={() => setCreateOpen(true)} onSearch={() => setSearchOpen(true)} />

      <main className="layout-main">
        <Outlet context={{ openCreate: () => setCreateOpen(true) }} />
      </main>

      {createOpen && <CreateModal onClose={() => setCreateOpen(false)} />}
      {searchOpen && (
        <SearchPanel
          onClose={() => setSearchOpen(false)}
          onGo={(username) => {
            setSearchOpen(false)
            navigate(`/${username}`)
          }}
        />
      )}
    </div>
  )
}
