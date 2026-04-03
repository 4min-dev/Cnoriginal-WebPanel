import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseService'
import type { Order } from '../../types/Order'
import type { NewOrder } from '../../types/NewOrder'

export const dobropostService = createApi({
    reducerPath: 'dobropostService',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getDobropostOrders: builder.query<{ data: { dobropost: Order[] } }, void>({
            query: () => ({
                url: '/orders'
            })
        }),
        newDrobropostOrder: builder.mutation<{ data: { dobropost: Order } }, Partial<NewOrder>>({
            query: (order) => ({
                url: '/orders',
                method: 'POST',
                body: order
            })
        }),
    })
})

export const { useGetDobropostOrdersQuery, useNewDrobropostOrderMutation } = dobropostService