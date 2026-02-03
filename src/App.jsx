import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Layout from './components/Layout'
import TaskManager from './pages/TaskManager'
import ProjectManager from './pages/ProjectManager'
import CommentManager from './pages/CommentManager'
import HistoryManager from './pages/HistoryManager'
import NotificationManager from './pages/NotificationManager'
import SearchManager from './pages/SearchManager'
import ReportManager from './pages/ReportManager'
import UserManager from './pages/UserManager'

export default function App() {
    useEffect(() => {
        document.title = 'Task Manager';
    }, []);

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
                    <Route path="historial" element={<HistoryManager />} />
                    <Route path="notificaciones" element={<NotificationManager />} />
                    <Route path="busqueda" element={<SearchManager />} />
                    <Route path="reportes" element={<ReportManager />} />
                    <Route path="users" element={<UserManager />} />
                </Route>
            </Routes>
        </Router>
    )
}