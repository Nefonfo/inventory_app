import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { BackendSingleResponse } from "@/types"

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
  }),
  endpoints: (builder) => ({
    recoverPassword: builder.mutation<
      BackendSingleResponse<string>,
      { email: string }
    >({
      query: (data) => {
        return {
          url: "/api/password_reset/",
          method: "POST",
          body: data,
        }
      },
    }),
    validatePassword: builder.mutation<any, { token: string }>({
      query: (data) => {
        return {
          url: '/api/password_reset/validate_token/',
          method: "POST",
          body: data
        }
      },
    }),
  }),
})

export const { useRecoverPasswordMutation, useValidatePasswordMutation } = authApi
