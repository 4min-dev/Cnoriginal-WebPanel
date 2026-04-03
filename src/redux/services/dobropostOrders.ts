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
    })
})

export const { useGetDobropostOrdersQuery, useNewDrobropostOrderMutation } = dobropostService