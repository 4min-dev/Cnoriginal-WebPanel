import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../../types/User'

interface AuthState {
    accessToken: string | null
    refreshToken: string | null
    isAuthenticated: boolean
    user: User | null
}

const loadAuthFromStorage = (): AuthState => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    return {
        accessToken: accessToken || null,
        refreshToken: refreshToken || null,
        isAuthenticated: !!accessToken,
        user: null
    }
}

const initialState: AuthState = loadAuthFromStorage();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{
            accessToken: string;
            refreshToken: string;
            user?: any
        }>) => {
            const { accessToken, refreshToken, user } = action.payload

            state.accessToken = accessToken
            state.refreshToken = refreshToken
            state.isAuthenticated = true
            if (user) state.user = user

            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)
        },

        setUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload
        },

        logout: (state) => {
            state.accessToken = null
            state.refreshToken = null
            state.isAuthenticated = false
            state.user = null

            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
        },
    }
})

export const { setCredentials, setUser, logout } = authSlice.actions
export default authSlice.reducer
