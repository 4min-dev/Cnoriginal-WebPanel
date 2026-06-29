import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseService'
import type { User } from '../../types/User'
import type { UserDataToChange } from '../../pages/profile/ui/PassportDataPopup'

export const userService = createApi({
    reducerPath: 'userService',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Profile'],
    endpoints: (builder) => ({
        getProfile: builder.query<{ data: User }, void>({
            query: () => ({
                url: '/profile'
            }),
            providesTags: ['Profile']
        }),
        getReceiptCode: builder.query<{ data: { code: string, qr: string } }, void>({
            query: () => ({
                url: '/profile/receipt-code'
            })
        }),
        updateProfile: builder.mutation<unknown, UserDataToChange>({
            query: (newUserData) => ({
                url: '/profile',
                method: 'PATCH',
                body: newUserData
            }),
            invalidatesTags: ['Profile']
        })
    }),
})

export const { useGetProfileQuery, useGetReceiptCodeQuery, useUpdateProfileMutation } = userService
