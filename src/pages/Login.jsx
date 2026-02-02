import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const { user, token, login, loading } = useAuth()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    // Redirect if already logged in with valid token
    useEffect(() => {
        if (user && token && !loading) {
            navigate('/app', { replace: true })
        }
    }, [user, token, loading, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        if (!username.trim() || !password.trim()) {
            setError('Ingrese usuario y contraseña')
            return
        }
        try {
            setSubmitting(true)
            await login(username.trim(), password)
            // Navigation will happen automatically via useEffect
        } catch (err) {
            setError('No se pudo iniciar sesión')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return null

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 border border-gray-200">
                <h1 className="text-2xl font-semibold text-slate-800 mb-1 text-center">Task Manager</h1>
                <p className="text-sm text-gray-600 text-center mb-6">Inicie sesión para continuar</p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nombre de usuario"
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                    >
                        {submitting ? 'Ingresando…' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
