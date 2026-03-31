import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseService'

export const userService = createApi({
    reducerPath: 'userService',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getProfile: builder.query<unknown, void>({
            query: () => ({
                url: '/profile'
            })
        })
    }),
})

export const { useGetProfileQuery } = userService