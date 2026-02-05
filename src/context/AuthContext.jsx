import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('auth')
      if (raw) {
        const saved = JSON.parse(raw)
        if (saved && typeof saved === 'object' && saved.token && saved.user) {
          // Verify that both user and token exist
          setUser(saved.user)
          setToken(saved.token)
        } else {
          // Clear invalid data
          localStorage.removeItem('auth')
        }
      }
    } catch (_) {
      // Clear corrupted data
      try {
        localStorage.removeItem('auth')
      } catch (_) {}
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (username, password) => {
    const u = String(username || '').trim()
    const p = String(password || '')
    if (!u || !p) throw new Error('Enter username and password')

    // Detectar automáticamente el entorno
    const getBaseUrl = () => {
      // Si estamos en localhost:5095, usar URL relativa
      if (window.location.port === '5095') {
        return ''
      }
      // Si estamos en production (Railway u otro), usar URL relativa también
      if (window.location.hostname !== 'localhost') {
        return ''
      }
      // Para desarrollo local, usar localhost:5095
      return 'http://localhost:5095'
    }

    const baseUrl = getBaseUrl()
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ username: u, password: p })
    })

    if (!res.ok) {
      if (res.status === 401) throw new Error('Invalid credentials')
      throw new Error('Authentication error')
    }

    const data = await res.json()
    const nextUser = data?.User || data?.user || null
    const nextToken = data?.Token || data?.token || null
    setUser(nextUser)
    setToken(nextToken)
    try {
      localStorage.setItem('auth', JSON.stringify({ user: nextUser, token: nextToken }))
    } catch (_) {}
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    try {
      localStorage.removeItem('auth')
    } catch (_) {}
  }, [])

  const value = useMemo(() => ({ user, token, loading, login, logout }), [user, token, loading, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
