import { RootState } from '@/stores/store'
import { UserDTO } from '@/types/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const profileApi = createApi({
    reducerPath: 'profileApi',
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
            query: () => '/user/profile/',
        })
    })
})

export const { useProfileQuery } = profileApi
