import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const NavigationBar = () => {
    const navigate = useNavigate()
    const location = useLocation()

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

    const currentTab = tabs.find(tab => tab.path === location.pathname)?.id || 'task'

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto flex gap-0">
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
        </nav>
    )
}

export default NavigationBar