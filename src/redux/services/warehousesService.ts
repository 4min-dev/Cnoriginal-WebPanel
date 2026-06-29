import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseService";
import type { WarehouseObject } from "../../types/WarehouseObject";

export const warehouseService = createApi({
    reducerPath: "warehouseService",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getWarehouses: builder.query<{ data: { data: WarehouseObject[] } }, void>({
            query: () => ({
                url: '/warehouses',
                method: 'GET'
            })
        })
    })
})

export const { useGetWarehousesQuery } = warehouseService
