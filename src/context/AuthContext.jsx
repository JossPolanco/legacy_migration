import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

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
        if (saved && typeof saved === 'object') {
          setUser(saved.user || saved)
          setToken(saved.token || null)
        }
      }
    } catch (_) {
      // ignore localStorage errors
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    const u = String(username || '').trim()
    const p = String(password || '')
    if (!u || !p) throw new Error('Ingrese usuario y contraseña')

    const baseUrl = window.location.port === '5095' ? '' : 'http://localhost:5095'
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ username: u, password: p })
    })

    if (!res.ok) {
      if (res.status === 401) throw new Error('Credenciales inválidas')
      throw new Error('Error de autenticación')
    }

    const data = await res.json()
    const nextUser = data?.User || data?.user || null
    const nextToken = data?.Token || data?.token || null
    setUser(nextUser)
    setToken(nextToken)
    try {
      localStorage.setItem('auth', JSON.stringify({ user: nextUser, token: nextToken }))
    } catch (_) {}
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    try {
      localStorage.removeItem('auth')
    } catch (_) {}
  }

  const value = useMemo(() => ({ user, token, loading, login, logout }), [user, token, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
