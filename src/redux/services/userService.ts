import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseService'
import type { User } from '../../types/User'

export const userService = createApi({
    reducerPath: 'userService',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getProfile: builder.query<{ data: User }, void>({
            query: () => ({
                url: '/profile'
            })
        })
    }),
})

export const { useGetProfileQuery } = userService