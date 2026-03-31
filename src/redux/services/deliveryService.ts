import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseService'
import type { Order } from '../../types/Order'

export const deliveryService = createApi({
    reducerPath: 'deliveryService',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getDeliveryOrders: builder.query<{ data: { delivery: Order[] } }, void>({
            query: () => ({
                url: '/delivery'
            })
        })
    }),
})

export const { useGetDeliveryOrdersQuery } = deliveryService