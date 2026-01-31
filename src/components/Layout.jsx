import React from 'react'
import { Outlet } from 'react-router-dom'
import NavigationBar from './NavigationBar'

const Layout = () => {
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