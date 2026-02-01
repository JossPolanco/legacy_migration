import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('auth')
      if (raw) {
        const saved = JSON.parse(raw)
        if (saved && typeof saved === 'object') {
          setUser(saved.user || saved)
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
    const token = data?.Token || data?.token || null
    setUser(nextUser)
    try {
      localStorage.setItem('auth', JSON.stringify({ user: nextUser, token }))
    } catch (_) {}
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem('auth')
    } catch (_) {}
  }

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
