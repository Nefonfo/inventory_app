import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

import { RootState } from "@/stores"
import { UserDTO } from "@/types"

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
      query: () => "/user/profile/",
    }),
    profileUpdate: builder.mutation<UserDTO, Partial<UserDTO>>({
      query: (data) => {
        const formData = new FormData()
        Object.keys(data).forEach((key) => {
          if (data[key as keyof UserDTO] !== undefined) {
            formData.append(key, data[key as keyof UserDTO] as string)
          }
        })
        console.log(data)
        return {
          url: "/user/profile/",
          method: "PUT",
          body: formData,
        }
      },
    }),
  }),
})

export const { useProfileQuery, useProfileUpdateMutation } = profileApi
