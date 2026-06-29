import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseService";

export const payAllOrders = createApi({
    reducerPath: "payAllOrders",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        payAllOrders: builder.mutation<{ data: { list: { id: string, error: string }[] } }, { orders: string[] }>({
            query: (orders) => ({
                url: '/orders-all-pay',
                method: 'POST',
                body: orders
            })
        }),
    })
})

export const { usePayAllOrdersMutation } = payAllOrders
