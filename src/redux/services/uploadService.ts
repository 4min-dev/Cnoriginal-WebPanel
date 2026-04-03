import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseService'
import type { NewOrder } from '../../types/NewOrder'

type OrderFile = {
    type: 'succes' | 'error',
    row_num: number,
    tracknumber: string,
    error: {
        column: string,
        error: string
    },
    order: NewOrder
}

export const uploadService = createApi({
    reducerPath: 'uploadService',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        uploadOrderImage: builder.mutation<{ data: { url: string } }, FormData>({
            query: (file) => ({
                url: '/upload/order-image',
                method: 'POST',
                body: file
            })
        }),
        uploadOrderFile: builder.mutation<{ data: OrderFile[] }, FormData>({
            query: (file) => ({
                url: '/upload/order-list-file',
                method: 'POST',
                body: file
            })
        }),
    })
})
export const { useUploadOrderImageMutation, useUploadOrderFileMutation } = uploadService