import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

const devMode = import.meta.env.VITE_DEV_MODE === 'true'

const ProtectedRoute = () => {

    const { isAuthenticated, isLoading, isError } = useAuth()

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">
            <p>Загрузка...</p>
        </div>
    }

    if ((!isAuthenticated || isError) && !devMode) {
        return <Navigate to="/authorization" replace />
    }

    return <Outlet />
}

export default ProtectedRoute