import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseService'


export const referralService = createApi({
    reducerPath: 'referralService',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getReferrals: builder.query<{ data: { qr: string, referral_url: string, referrals: number } }, void>({
            query: () => ({
                url: '/referrals'
            })
        }),
    }),
})

export const { useGetReferralsQuery } = referralService