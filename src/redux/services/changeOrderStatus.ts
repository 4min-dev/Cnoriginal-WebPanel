import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseService'
import type { BxStatuses } from '../../types/BxStatuses'

export const changeOrderStatus = createApi({
    reducerPath: 'changeOrderStatus',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Client'],
    endpoints: (builder) => ({
        changeStatus: builder.mutation<
            { data: { id: string; error: string; status: BxStatuses }[] },
            string[]
        >({
            query: (ids) => ({
                url: '/orders-status-delivery',
                method: 'POST',
                body: ids
            })
        })
    })
})

export const { useChangeStatusMutation } = changeOrderStatus