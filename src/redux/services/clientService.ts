import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseService'
import type { User } from '../../types/User'
import type { UserDataToChange } from '../../pages/profile/ui/PassportDataPopup'

type Clients = {
    id: string
} & User

export const clientService = createApi({
    reducerPath: 'clientService',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Client'],
    endpoints: (builder) => ({
        getUserClients: builder.query<{ data: Clients[] }, void>({
            query: () => ({
                url: '/clients'
            }),
            providesTags: ['Client']
        }),
        updateClientData: builder.mutation<{ data: UserDataToChange }, { client_id: string, userData: UserDataToChange }>({
            query: ({ client_id, userData }) => ({
                url: `/clients/${client_id}`,
                method: 'PATCH',
                body: userData
            }),
            invalidatesTags: ['Client']
        }),
        deleteClient: builder.mutation<{ data: true }, string>({
            query: (client_id) => ({
                url: `/clients/${client_id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Client']
        }),
        newClient: builder.mutation<{ data: UserDataToChange }, UserDataToChange>({
            query: (user) => ({
                url: '/clients',
                method: 'POST',
                body: user
            }),
            invalidatesTags: ['Client']
        })
    })
})
export const { useGetUserClientsQuery, useDeleteClientMutation, useUpdateClientDataMutation, useNewClientMutation } = clientService