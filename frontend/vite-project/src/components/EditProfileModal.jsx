import { useRef, useState } from 'react'
import { FiX } from 'react-icons/fi'
import { updateProfile, uploadAvatar } from '../api/users'
import Avatar from './Avatar'
import Spinner from './Spinner'
import './EditProfileModal.css'

export default function EditProfileModal({ profile, onClose, onSaved }) {
  const [fullName, setFullName] = useState(profile.full_name || '')
  const [bio, setBio] = useState(profile.bio || '')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  const handleAvatar = async (file) => {
    if (!file) return
    setUploadingAvatar(true)
    setError('')
    try {
      const updated = await uploadAvatar(file)
      setAvatarUrl(updated.avatar_url)
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not upload photo.')
    } finally {
      setUploadingAvatar(false)
      // Reset file input so re-selecting the same file triggers onChange
      if (fileRef.current) {
        fileRef.current.value = ''
      }
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await updateProfile({ full_name: fullName, bio })
      onSaved({ full_name: fullName, bio, avatar_url: avatarUrl })
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not save changes.')
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <button className="modal-close" onClick={onClose} aria-label="Close">
        <FiX />
      </button>
      <div className="edit" onClick={(e) => e.stopPropagation()}>
        <h2 className="edit__title">Edit profile</h2>

        <div className="edit__avatar-row">
          <div className="edit__avatar-wrapper">
            <Avatar src={avatarUrl} username={profile.username} size={56} />
            {uploadingAvatar && (
              <div className="edit__avatar-loading">
                <Spinner />
              </div>
            )}
          </div>
          <div className="edit__avatar-info">
            <strong>{profile.username}</strong>
            <button
              className="link-blue"
              onClick={() => fileRef.current?.click()}
              disabled={uploadingAvatar}
            >
              {uploadingAvatar ? 'Uploading…' : 'Change profile photo'}
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleAvatar(e.target.files?.[0])}
          />
        </div>

        <label className="edit__field">
          <span>Name</span>
          <input
            value={fullName}
            maxLength={100}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
          />
        </label>

        <label className="edit__field">
          <span>Bio</span>
          <textarea
            value={bio}
            maxLength={500}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell people about yourself"
          />
        </label>

        {error && <p className="edit__error">{error}</p>}

        <div className="edit__actions">
          <button className="btn-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave} disabled={saving || uploadingAvatar}>
            {saving ? <Spinner /> : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
