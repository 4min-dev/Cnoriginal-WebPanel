import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    QueryReturnValue,
} from '@reduxjs/toolkit/query'

import { setCredentials, logout } from '../slices/authSlice'
import { tgInitData } from '../../assets/tgInitData'
import type { RootState } from '../../store'

const API_URL = import.meta.env.VITE_API_URL
const devMode = import.meta.env.VITE_DEV_MODE

const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState, arg }) => {
        const token = (getState() as RootState).auth.accessToken

        const url =
            typeof arg === 'string'
                ? arg
                : arg?.url

        const isRefreshRequest = url === '/auth/refresh'

        if (token && !isRefreshRequest) {
            headers.set('Authorization', `Bearer ${token}`)
        }

        return headers
    }
})

type RefreshResponse = {
    data: {
        access_token: string
        refresh_token?: string
    }
}

let isRefreshing = false
let refreshPromise: Promise<QueryReturnValue<RefreshResponse, FetchBaseQueryError>> | null = null

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.status === 401) {
        const currentRefreshToken = (api.getState() as RootState).auth.refreshToken

        if (!currentRefreshToken && !devMode) {
            api.dispatch(logout())
            return result
        }

        if (!isRefreshing) {
            isRefreshing = true

            refreshPromise = baseQuery(
                {
                    url: '/auth/refresh',
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${currentRefreshToken}`,
                        'X-Tg-Init-Data': tgInitData,
                    },
                },
                api,
                extraOptions
            ) as Promise<QueryReturnValue<RefreshResponse, FetchBaseQueryError>>

            refreshPromise.finally(() => {
                isRefreshing = false
                refreshPromise = null
            })
        }

        const refreshResult = await refreshPromise

        if (refreshResult?.data) {
            const { access_token, refresh_token } = refreshResult.data.data

            api.dispatch(
                setCredentials({
                    accessToken: access_token,
                    refreshToken: refresh_token ?? currentRefreshToken!,
                })
            )

            result = await baseQuery(args, api, extraOptions)

        } else if (!devMode) {
            api.dispatch(logout())
        }
    }

    return result
}