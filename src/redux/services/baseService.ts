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

const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        return headers
    },
})

type RefreshResponse = {
    access_token: string
    refresh_token?: string
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

        if (!currentRefreshToken) {
            api.dispatch(logout())
            return result
        }

        if (!isRefreshing) {
            isRefreshing = true

            refreshPromise = baseQuery(
                {
                    url: '/auth/auth/refresh',
                    method: 'POST',
                    headers: {
                        'X-Tg-Init-Data': tgInitData,
                    },
                    body: {
                        refresh_token: currentRefreshToken,
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
            const { access_token, refresh_token } = refreshResult.data

            api.dispatch(
                setCredentials({
                    accessToken: access_token,
                    refreshToken: refresh_token ?? currentRefreshToken,
                })
            )

            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logout())
        }
    }

    return result
}