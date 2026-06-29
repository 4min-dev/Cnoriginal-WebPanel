import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseService'

type NewUser = {
    code: string,
    phone: string,
    first_name: string,
    last_name: string,
    patronymic_name: string,
    birthday: string,
    city: string,
    street: string,
    house?: string,
    apartment?: string,
    tg_id?: number | null,
    username?: string,
    personal_data_agreement: boolean,
    privacy_policy_agreement: boolean,
    offer_agreement: boolean,
    marketing_consent: boolean
}

export const authService = createApi({
    reducerPath: 'authService',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        telegramLogin: builder.query<{ data: { access_token: string, refresh_token: string } }, string>({
            query: (tgInitData) => ({
                url: '/auth/telegram',
                method: 'GET',
                headers: {
                    'X-Tg-Init-Data': tgInitData,
                },
            }),
        }),
        signup: builder.mutation<{ data: { access_token: string, refresh_token: string } }, NewUser>({
            query: (user) => ({
                url: '/auth/signup',
                method: 'POST',
                body: user
            })
        }),
        login: builder.query<{ data: { access_token: string, refresh_token: string } }, { phone: string, code: string }>({
            query: ({ phone, code }) => ({
                url: '/auth/verify-code',
                method: 'POST',
                body: {
                    phone,
                    code
                }
            })
        }),
        sendVerifyCode: builder.mutation<{ data: { status: boolean } }, { phone: string, auth: boolean, tg: boolean }>({
            query: ({ phone, auth, tg }) => ({
                url: '/auth/send-code',
                method: 'POST',
                body: {
                    phone,
                    auth,
                    tg
                }
            })
        }),
        verifyCode: builder.mutation<{ data: { access_token: string, refresh_token: string } }, { phone: string, code: string }>({
            query: ({ phone, code }) => ({
                url: '/auth/verify-code',
                method: 'POST',
                body: {
                    phone,
                    code
                }
            })
        }),
        verifySignupCode: builder.mutation<{ data: { status: boolean } }, { phone: string, code: string }>({
            query: ({ phone, code }) => ({
                url: '/auth/verify-signup-code',
                method: 'POST',
                body: {
                    phone,
                    code
                }
            })
        }),
        logout: builder.mutation<string, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST'
            })
        })
    }),
})

export const { useTelegramLoginQuery, useSignupMutation, useLoginQuery, useSendVerifyCodeMutation, useVerifyCodeMutation, useVerifySignupCodeMutation, useLogoutMutation } = authService
