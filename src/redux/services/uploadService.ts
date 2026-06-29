import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseService'
import type { OrderFile } from '../../types/OrderFile'

export const uploadService = createApi({
    reducerPath: 'uploadService',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        uploadOrderImage: builder.mutation<{ data: { url: string } }, FormData>({
            query: (file) => ({
                url: '/upload/order-image',
                method: 'POST',
                body: file,
                formData: true
            })
        }),
        uploadOrderFile: builder.mutation<{ data: { filename: string, orders: OrderFile[], type: 'xlsx' | 'xls' | 'csv' } }, FormData>({
            query: (file) => ({
                url: '/upload/order-list-file',
                method: 'POST',
                body: file,
                formData: true
            })
        }),
        uploadProfileAvatar: builder.mutation<{ data: { url: string, type: 'profile' } }, FormData>({
            query: (file) => ({
                url: '/upload/profile-image',
                method: 'POST',
                body: file,
                formData: true
            })
        }),
        deleteProfileAvatar: builder.mutation<{ data: boolean }, void>({
            query: () => ({
                url: '/upload/profile-image',
                method: 'DELETE'
            })
        })
    })
})
export const { useUploadOrderImageMutation, useUploadOrderFileMutation, useUploadProfileAvatarMutation, useDeleteProfileAvatarMutation } = uploadService