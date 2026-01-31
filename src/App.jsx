import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Layout from './components/Layout'

export default function App() {
    return (
        <Router>
            
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/app" element={<Layout />}>
                    <Route index element={<Navigate to="/app/task" replace />} />
                    <Route path="task" element={<div>Task Page</div>} />
                    <Route path="projects" element={<div>Projects Page</div>} />
                    <Route path="comments" element={<div>Comments Page</div>} />
                    <Route path="historial" element={<div>History Page</div>} />
                    <Route path="notificaciones" element={<div>Notificaciones Page</div>} />
                    <Route path="busqueda" element={<div>Búsqueda Page</div>} />
                    <Route path="reportes" element={<div>Reportes Page</div>} />
                </Route>
            </Routes>
        </Router>
    )
}