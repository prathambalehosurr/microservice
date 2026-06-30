import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const canSubmit = form.identifier && form.password.length >= 6

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.identifier, form.password)
      const to = location.state?.from?.pathname || '/'
      navigate(to, { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Sorry, your credentials were incorrect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="logo-text auth__logo">Instagram</h1>

        <form className="auth__form" onSubmit={handleSubmit}>
          <input
            className="auth__input"
            placeholder="Username or email"
            value={form.identifier}
            onChange={(e) => setForm({ ...form, identifier: e.target.value })}
            autoComplete="username"
          />
          <input
            className="auth__input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="current-password"
          />
          <button className="btn-primary auth__submit" disabled={!canSubmit || loading}>
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <div className="auth__divider">OR</div>

        {error && <p className="auth__error">{error}</p>}

        <Link to="/signup" className="link-blue" style={{ fontSize: 14, marginTop: 4 }}>
          Forgot password?
        </Link>
      </div>

      <div className="auth__switch">
        Don't have an account?{' '}
        <Link to="/signup" className="link-blue">
          Sign up
        </Link>
      </div>
    </div>
  )
}
