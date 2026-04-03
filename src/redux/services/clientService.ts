import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseService'
import type { User } from '../../types/User'

type Clients = {
    id: string
} & User

export const clientService = createApi({
    reducerPath: 'clientService',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getUserClients: builder.query<{ data: Clients[] }, void>({
            query: () => ({
                url: '/clients'
            })
        })
    })
})
export const { useGetUserClientsQuery } = clientService