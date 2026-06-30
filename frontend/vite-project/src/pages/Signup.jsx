import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    full_name: '',
    username: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const canSubmit =
    form.email && form.username.length >= 3 && form.password.length >= 6

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup(form)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not create account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="logo-text auth__logo">Instagram</h1>
        <p className="auth__subtitle">Sign up to see photos and videos from your friends.</p>

        <form className="auth__form" onSubmit={handleSubmit}>
          <input
            className="auth__input"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="email"
          />
          <input
            className="auth__input"
            placeholder="Full Name"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            autoComplete="name"
          />
          <input
            className="auth__input"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            autoComplete="username"
          />
          <input
            className="auth__input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="new-password"
          />

          {error && <p className="auth__error">{error}</p>}

          <p className="auth__terms" style={{ padding: '8px 0' }}>
            People who use our service may have uploaded your contact information.
          </p>

          <button className="btn-primary auth__submit" disabled={!canSubmit || loading}>
            {loading ? 'Signing up…' : 'Sign up'}
          </button>
        </form>
      </div>

      <div className="auth__switch">
        Have an account?{' '}
        <Link to="/login" className="link-blue">
          Log in
        </Link>
      </div>
    </div>
  )
}
