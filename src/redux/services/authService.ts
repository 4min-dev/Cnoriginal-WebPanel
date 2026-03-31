import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseService'

export const authService = createApi({
    reducerPath: 'authService',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        telegramLogin: builder.query<{ data: { access_token: string, refresh_token: string } }, string>({
            query: (tgInitData) => ({
                url: '/auth/auth/telegram',
                method: 'GET',
                headers: {
                    'X-Tg-Init-Data': tgInitData,
                },
            }),
        }),
    }),
})

export const { useTelegramLoginQuery } = authService