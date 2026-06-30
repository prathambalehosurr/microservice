import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getToken, clearToken } from '../api/client'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on first load.
  useEffect(() => {
    let active = true
    async function bootstrap() {
      if (!getToken()) {
        setLoading(false)
        return
      }
      try {
        const me = await authApi.getMe()
        if (active) setUser(me)
      } catch {
        clearToken()
      } finally {
        if (active) setLoading(false)
      }
    }
    bootstrap()
    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (usernameOrEmail, password) => {
    await authApi.login(usernameOrEmail, password)
    const me = await authApi.getMe()
    setUser(me)
    return me
  }, [])

  const signup = useCallback(async (payload) => {
    const data = await authApi.signup(payload)
    // signup returns the user, but fetch the full profile (with counts) for consistency.
    const me = await authApi.getMe()
    setUser(me)
    return data
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
  }, [])

  // Allow pages to refresh the cached current user (e.g. after editing profile).
  const refreshUser = useCallback(async () => {
    const me = await authApi.getMe()
    setUser(me)
    return me
  }, [])

  const value = { user, loading, login, signup, logout, refreshUser, setUser }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
