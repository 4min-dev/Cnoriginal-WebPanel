import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseService'


export const referralService = createApi({
    reducerPath: 'referralService',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getReferrals: builder.query<{ data: { qr: string, referral_url: string, referrals: number, sum: number } }, void>({
            query: () => ({
                url: '/referrals'
            })
        }),
        getReferralsHistory: builder.query<{ data: { id: string, bonus_paid: number, month: string, created_at: string }[] }, void>({
            query: () => ({
                url: '/referrals/bonus-history'
            })
        })
    }),
})

export const { useGetReferralsQuery, useGetReferralsHistoryQuery } = referralService