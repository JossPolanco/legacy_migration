import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NavigationBar from './NavigationBar'

const Layout = () => {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-lg text-gray-600">Cargando...</div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <NavigationBar />
            <main className="max-w-7xl mx-auto py-6 px-4">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout