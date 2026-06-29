import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseService";

export const paymentService = createApi({
    reducerPath: "paymentService",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        createPayment: builder.mutation<{ data: { payment_link: string, payment_id: number, amount: number, status: 'success' | 'pending' | 'fail' | 'unknown', created_at: string } }, { amount: number }>({
            query: ({ amount }) => ({
                url: "/payments",
                method: "POST",
                params: { amount }
            }),
        }),

        checkPaymentStatus: builder.mutation<{ data: { amount: number, status: 'success' | 'pending' | 'fail' | 'unknown' } }, number>({
            query: (bill_id) => ({
                url: `/payments/${bill_id}`,
                method: "GET",
            }),
        }),
    }),
})

export const { useCreatePaymentMutation, useCheckPaymentStatusMutation } = paymentService
