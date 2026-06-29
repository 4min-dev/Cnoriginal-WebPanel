import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseService";

export const payAllDeliveries = createApi({
    reducerPath: "payAllDeliveries",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        payAllDeliveries: builder.mutation<{ data: { list: { id: string, error: string }[] } }, { deliveries: string[] }>({
            query: (deliveries) => ({
                url: '/delivery-all-pay',
                method: 'POST',
                body: deliveries
            })
        }),
    })
})

export const { usePayAllDeliveriesMutation } = payAllDeliveries
