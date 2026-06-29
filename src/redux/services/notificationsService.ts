import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseService'
import type Notification from '../../types/Notification'
import type { NotificationStatus } from '../../types/NotificationStatus'

export const notificationsService = createApi({
    reducerPath: 'notificationsService',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Notification'],
    endpoints: (builder) => ({
        getNotifications: builder.query<{ data: Notification[] }, void>({
            query: () => ({
                url: '/orders-history'
            }),
            providesTags: ['Notification']
        }),
        deleteNotification: builder.mutation<{ data: boolean }, { notification_id: string, type: NotificationStatus }>({
            query: ({ notification_id, type }) => ({
                url: `/orders-history/${notification_id}/type/${type}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Notification']
        }),
        deleteAllNotifications: builder.mutation<{ data: boolean }, { notifications?: { id: string, type: 'dobropost' | 'dobropost_bx' | 'delivery' }[] }>({
            query: ({ notifications }) => ({
                url: '/orders-history',
                method: 'DELETE',
                body: notifications
            }),
            invalidatesTags: ['Notification']
        })
    }),
})

export const { useGetNotificationsQuery, useDeleteAllNotificationsMutation, useDeleteNotificationMutation } = notificationsService