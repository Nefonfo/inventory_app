import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { RootState } from "@/stores"
import { BackendSingleResponse, PasswordDTO, UserDTO } from "@/types"

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    prepareHeaders: (headers, { getState }) => {
      const { auth } = getState() as RootState
      headers.set("Authorization", `token ${auth.token}`)
      return headers
    },
  }),
  endpoints: (builder) => ({
    profile: builder.query<UserDTO, string>({
      query: () => "/api/user/profile/",
    }),
    profileUpdate: builder.mutation<UserDTO, Partial<UserDTO>>({
      query: (data) => {
        const formData = new FormData()
        Object.keys(data).forEach((key) => {
          if (data[key as keyof UserDTO] !== undefined) {
            formData.append(key, data[key as keyof UserDTO] as string)
          }
        })
        return {
          url: "/api/user/profile/",
          method: "PUT",
          body: formData,
        }
      },
    }),
    passwordUpdate: builder.mutation<
      BackendSingleResponse<string>,
      PasswordDTO
    >({
      query: (data) => {
        return {
          url: "/api/user/profile/change_password",
          method: "PUT",
          body: data,
        }
      },
    }),
  }),
})

export const {
  useProfileQuery,
  useProfileUpdateMutation,
  usePasswordUpdateMutation,
} = profileApi
