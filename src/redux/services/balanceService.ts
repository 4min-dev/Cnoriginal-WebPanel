import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseService'

export type BalanceTransaction = {
    id: string,
    user_id: string,
    dobropost_order_id: string | null,
    delivery_order_id: string | null,
    self_redemption_order_id: string | null,
    order_description: string | null,
    order_tracking_number: string | null,
    amount: number,
    comment: string,
    type: "plus" | "minus",
    created_at: string
}

export const balanceService = createApi({
    reducerPath: 'balanceService',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getBalance: builder.query<{
            data: BalanceTransaction[]
        }, { start_date?: string; end_date?: string }>({
            query: (args) => ({
                url: '/statistic/balance',
                params: args
            })
        })
    }),
})

export const { useGetBalanceQuery } = balanceService
