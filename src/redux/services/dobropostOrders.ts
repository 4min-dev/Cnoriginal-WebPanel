import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseService'
import type { Order } from '../../types/Order'
import type { NewOrder } from '../../types/NewOrder'

export const dobropostService = createApi({
    reducerPath: 'dobropostService',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['DobropostOrders'],
    endpoints: (builder) => ({
        getDobropostOrders: builder.query<{ data: { dobropost: Order[] } }, void>({
            query: () => ({
                url: '/orders'
            }),
            providesTags: ['DobropostOrders']
        }),
        newDrobropostOrder: builder.mutation<{ data: { dobropost: Order } }, Partial<NewOrder>>({
            query: (order) => ({
                url: '/orders',
                method: 'POST',
                body: order
            }),
            invalidatesTags: ['DobropostOrders']
        }),
        payDobropostOrder: builder.mutation<{ data: { id: string, status: 'success' | 'error' } }, string>({
            query: (order_id) => ({
                url: `/orders/${order_id}/pay`,
                method: 'POST'
            }),
            invalidatesTags: ['DobropostOrders']
        }),
        getDobropostOrderTracking: builder.query<{ data: { status: string | null } }, string>({
            query: (order_id) => ({
                url: `/orders/${order_id}/tracking`
            })
        })
    })
})

export const { useGetDobropostOrdersQuery, useNewDrobropostOrderMutation, usePayDobropostOrderMutation, useGetDobropostOrderTrackingQuery } = dobropostService
