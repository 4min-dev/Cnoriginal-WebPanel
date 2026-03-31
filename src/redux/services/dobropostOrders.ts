import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseService'
import type { Order } from '../../types/Order'

export const dobropostService = createApi({
    reducerPath: 'dobropostService',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getDobropostOrders: builder.query<{ data: { dobropost: Order[] } }, void>({
            query: () => ({
                url: '/orders'
            })
        })
    }),
})

export const { useGetDobropostOrdersQuery } = dobropostService