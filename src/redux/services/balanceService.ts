import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseService'

export const balanceService = createApi({
    reducerPath: 'balanceService',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getBalance: builder.query<{
            data: {
                id: number,
                user_id: string,
                dobropost_order_id: string | null,
                delivery_order_id: string | null,
                self_redemption_order_id: string | null,
                amount: number,
                comment: string,
                type: "plus" | "minus",
                created_at: string
            }[]
        }, { start_date?: string | null; end_date?: string | null }>({
            query: (args) => ({
                url: '/statistic/balance',
                params: args
            })
        })
    }),
})

export const { useGetBalanceQuery } = balanceService