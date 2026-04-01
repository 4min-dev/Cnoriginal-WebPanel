import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseService'

type PaySubscription = {
    old_end: string,
    new_end: string,
    amount: number,
    comment: string
}

export const subscriptionService = createApi({
    reducerPath: 'subscriptionService',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Subscription'],
    endpoints: (builder) => ({
        getSubscriptionStatus: builder.query<{ data: boolean }, void>({
            query: () => ({
                url: '/subscribers/check'
            }),
            providesTags: ['Subscription']
        }),
        paySubscription: builder.mutation<{ data: PaySubscription }, void>({
            query: () => ({
                url: '/subscribers/pay',
                method: 'POST'
            }),
            invalidatesTags: ['Subscription']
        })
    }),
})

export const { useGetSubscriptionStatusQuery, usePaySubscriptionMutation } = subscriptionService