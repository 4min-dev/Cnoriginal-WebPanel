import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseService'
import type Notification from '../../types/Notification'

export const notificationsService = createApi({
    reducerPath: 'notificationsService',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getNotifications: builder.query<{ data: Notification[] }, void>({
            query: () => ({
                url: '/orders-history'
            })
        })
    }),
})

export const { useGetNotificationsQuery } = notificationsService