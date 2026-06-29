import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/dashboard/Dashboard'
import Orders from './pages/orders/Orders'
import Delivery from './pages/delivery/Delivery'
import Registration from './pages/registration/Registration'
import ProtectedRoute from './ProtectedRoute'
import Authorization from './pages/authorization/Authorization'
import { useTelegramLoginQuery } from './redux/services/authService'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCredentials } from './redux/slices/authSlice'
import Profile from './pages/profile/Profile'
import Warehouses from './pages/warehouses/Warehouses'
import { useAuth } from './hooks/useAuth'

const devMode = import.meta.env.VITE_DEV_MODE === 'true'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, isLoading } = useAuth()

  const { data: devProfile } = useTelegramLoginQuery('21567878112', {
    skip: !devMode
  })

  useEffect(() => {
    if (!devProfile) return
    dispatch(setCredentials({
      accessToken: devProfile.data.access_token,
      refreshToken: devProfile.data.refresh_token
    }))

  }, [devProfile, dispatch])

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/warehouses" element={<Warehouses />} />
      </Route>

      <Route path="/registration" element={isLoading ? <h3>Загрука</h3> : isAuthenticated ? <Navigate to="/dashboard" replace /> : <Registration />} />
      <Route path="/authorization" element={isLoading ? <div className="flex items-center justify-center min-h-screen">
        <p>Загрузка...</p>
      </div> : isAuthenticated ? <Navigate to="/dashboard" replace /> : <Authorization />} />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes >
  )
}

export default App