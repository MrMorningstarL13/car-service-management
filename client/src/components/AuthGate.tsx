// src/components/AuthGate.tsx
import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '../stores/useAuthStore'

export default function AuthGate() {
    const { loggedIn, checkAuth } = useAuthStore()

    useEffect(() => {
        checkAuth()
    }, [])

    if (!loggedIn) return <Navigate to="/login" replace />

    return <Outlet />
}
