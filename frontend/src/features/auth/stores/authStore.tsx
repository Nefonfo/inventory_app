import { createSlice } from '@reduxjs/toolkit'

import { authLogin } from '@/features/auth/stores/authActions'
import { AuthState } from '@/features/auth/types/types'
import { BackendSingleResponse, UserDTO } from '@/types/types'


const getInitialState: AuthState = {
    loading: false,
    token: null,
    errors: null,
    user: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: getInitialState,
    reducers: {
        logout(state) {
            state.token = null
            state.user = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(authLogin.pending, (state) => {
            state.loading = true
            state.errors = null
        }),
            builder.addCase(authLogin.fulfilled, (state, { payload }) => {
                state.loading = false
                state.token = payload.token
                state.user = payload.user as UserDTO
                state.errors = null
            }),
            builder.addCase(authLogin.rejected, (state, { payload }) => {
                console.log('REJECTED')
                state.loading = false
                state.errors = payload as BackendSingleResponse<string>
            })
    },

})
export const { logout } = authSlice.actions
export default authSlice.reducer
