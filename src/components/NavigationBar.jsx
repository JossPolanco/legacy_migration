import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NavigationBar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { logout } = useAuth()

    const tabs = [
        { id: 'task', label: 'Task', path: '/app/task' },
        { id: 'projects', label: 'Projects', path: '/app/projects' },
        { id: 'comments', label: 'Comments', path: '/app/comments' },
        { id: 'history', label: 'History', path: '/app/historial' },
        { id: 'notificaciones', label: 'Notificaciones', path: '/app/notificaciones' },
        { id: 'busqueda', label: 'Búsqueda', path: '/app/busqueda' },
        { id: 'reportes', label: 'Reportes', path: '/app/reportes' },
    ]

    const handleTabClick = (path) => {
        navigate(path)
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const currentTab = tabs.find(tab => tab.path === location.pathname)?.id || 'task'

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex gap-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`px-6 py-3 text-sm border-b-2 transition-all relative ${
                                currentTab === tab.id
                                    ? 'text-slate-800 border-blue-500 font-semibold'
                                    : 'text-gray-600 border-transparent hover:bg-gray-50 hover:text-slate-800'
                            }`}
                            onClick={() => handleTabClick(tab.path)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="px-6">
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default NavigationBar