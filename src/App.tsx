import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useTelegramLoginQuery } from './redux/services/authService'
import { setCredentials } from './redux/slices/authSlice'
import { useAppDispatch } from './hooks/useAppDispatch'
import Dashboard from './pages/dashboard/Dashboard'
import Orders from './pages/orders/Orders'
import Delivery from './pages/delivery/Delivery'
import TelegramLoginWidget from './ui/TelegramLoginWidget'
import type TelegramUser from './types/TelegramUser'

const devMode = import.meta.env.VITE_DEV_MODE

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramUser) => void
  }
}

function App() {

  function handleTelegramAuth(user: TelegramUser) {
    window.localStorage.setItem('user', JSON.stringify(user))
    window.location.reload()
  }

  const user = JSON.parse(window.localStorage.getItem('user') || '{}') as TelegramUser

  const tgInitData = window.location.search.slice(1)

  const dispatch = useAppDispatch()
  const { data, isSuccess, isError } = useTelegramLoginQuery(tgInitData)

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(
        setCredentials({
          accessToken: data.data.access_token,
          refreshToken: data.data.refresh_token,
        })
      )
    }

    if (isError) {
      console.error('Не удалось авторизоваться через Telegram')
    }
  }, [isSuccess, isError, data, dispatch])

  if ((!user || !user.id) && !devMode) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h1>Добро пожаловать!</h1>
        <p>Войдите через Telegram для доступа к приложению</p>
        <TelegramLoginWidget
          onAuth={handleTelegramAuth}
          botName="oakodlogin_bot"
        />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/delivery" element={<Delivery />} />
    </Routes>
  )
}

export default App