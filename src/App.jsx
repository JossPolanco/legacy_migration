import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Layout from './components/Layout'
import TaskManager from './pages/TaskManager'
import ProjectManager from './pages/ProjectManager'
import CommentManager from './pages/CommentManager'

export default function App() {
    return (
        <Router>
            
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/app" element={<Layout />}>
                    <Route index element={<Navigate to="/app/task" replace />} />
                    <Route path="task" element={<TaskManager />} />
                    <Route path="projects" element={<ProjectManager />} />
                    <Route path="comments" element={<CommentManager />} />
                    <Route path="historial" element={<div>History Page</div>} />
                    <Route path="notificaciones" element={<div>Notificaciones Page</div>} />
                    <Route path="busqueda" element={<div>Búsqueda Page</div>} />
                    <Route path="reportes" element={<div>Reportes Page</div>} />
                </Route>
            </Routes>
        </Router>
    )
}