import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseService";

export const sheetsService = createApi({
    reducerPath: "sheetsService",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getUrlOrdersSheet: builder.query<{ data: string }, void>({
            query: () => ({
                url: '/sheets/orders'
            })
        }),
        getUrlTransactionsSheet: builder.query<{ data: string }, void>({
            query: () => ({
                url: '/sheets/transactions'
            })
        })
    })
})

export const { useLazyGetUrlOrdersSheetQuery, useLazyGetUrlTransactionsSheetQuery } = sheetsService
