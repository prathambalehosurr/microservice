import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiX } from 'react-icons/fi'
import { BiImages } from 'react-icons/bi'
import { createPost } from '../api/posts'
import { createStory } from '../api/stories'
import { createReel } from '../api/reels'
import Spinner from './Spinner'
import './CreateModal.css'

const TABS = [
  { key: 'post', label: 'Post', accept: 'image/*' },
  { key: 'story', label: 'Story', accept: 'image/*,video/*' },
  { key: 'reel', label: 'Reel', accept: 'video/*' },
]

export default function CreateModal({ onClose }) {
  const [tab, setTab] = useState('post')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)
  const changeRef = useRef(null)
  const navigate = useNavigate()

  const activeTab = TABS.find((t) => t.key === tab)
  const isVideo = file && file.type.startsWith('video')

  const pickFile = (f) => {
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setError('')
    setDragOver(false)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    pickFile(e.dataTransfer.files?.[0])
  }

  const switchTab = (key) => {
    setTab(key)
    setFile(null)
    setPreview(null)
    setError('')
    setCaption('')
  }

  const handleShare = async () => {
    if (!file) return
    setSubmitting(true)
    setError('')
    try {
      if (tab === 'post') {
        await createPost(file, caption)
        navigate('/')
      } else if (tab === 'story') {
        await createStory(file)
        navigate('/')
      } else {
        await createReel(file, { caption })
        navigate('/reels')
      }
      onClose()
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const showCaption = tab !== 'story' && file

  const dropHints = {
    post: 'Supports JPG, PNG, WebP & GIF',
    story: 'Supports photos and videos',
    reel: 'Supports MP4, MOV & WebM',
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <button className="modal-close" onClick={onClose} aria-label="Close">
        <FiX />
      </button>

      <div className="create" onClick={(e) => e.stopPropagation()}>
        <div className="create__header">
          <span>Create new {activeTab.label.toLowerCase()}</span>
          {file && !submitting && (
            <button className="create__share" onClick={handleShare}>
              Share
            </button>
          )}
        </div>

        <div className="create__tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`create__tab ${tab === t.key ? 'create__tab--active' : ''}`}
              onClick={() => switchTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="create__body">
          {submitting ? (
            <div className="create__loading">
              <Spinner />
              <p>Sharing your {activeTab.label.toLowerCase()}…</p>
            </div>
          ) : !file ? (
            <div
              className={`create__drop ${dragOver ? 'create__drop--dragover' : ''}`}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
            >
              <div className="create__drop-icon-wrap">
                <BiImages className="create__drop-icon" />
              </div>
              <p className="create__drop-title">
                Drag photos and videos here
              </p>
              <p className="create__drop-subtitle">{dropHints[tab]}</p>
              <button
                className="btn-primary"
                onClick={(e) => {
                  e.stopPropagation()
                  inputRef.current?.click()
                }}
              >
                Select from computer
              </button>
              <input
                ref={inputRef}
                type="file"
                accept={activeTab.accept}
                hidden
                onChange={(e) => {
                  pickFile(e.target.files?.[0])
                  e.target.value = ''
                }}
              />
            </div>
          ) : (
            <div className={`create__compose ${showCaption ? 'create__compose--split' : ''}`}>
              <div className="create__preview">
                {isVideo ? (
                  <video src={preview} controls playsInline />
                ) : (
                  <img src={preview} alt="preview" />
                )}
                <button
                  className="create__change-file"
                  onClick={() => changeRef.current?.click()}
                >
                  Change
                </button>
                <input
                  ref={changeRef}
                  type="file"
                  accept={activeTab.accept}
                  hidden
                  onChange={(e) => {
                    pickFile(e.target.files?.[0])
                    e.target.value = ''
                  }}
                />
              </div>
              {showCaption && (
                <div className="create__caption">
                  <textarea
                    placeholder="Write a caption…"
                    maxLength={2200}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                  <span className="create__count">{caption.length}/2,200</span>
                </div>
              )}
            </div>
          )}
          {error && <p className="create__error">{error}</p>}
        </div>
      </div>
    </div>
  )
}
