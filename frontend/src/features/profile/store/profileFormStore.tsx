import { createSlice } from "@reduxjs/toolkit"

import { ProfileFormState } from "@/features/profile/types"

const getInitialState: ProfileFormState = {
  loading: false,
  errors: null,
  info: null,
}

export const profileFormStore = createSlice({
  name: "profileForm",
  initialState: getInitialState,
  reducers: {
    resetProfileForm(state) {
      state.loading = false
      state.errors = null
      state.info = null
    },
    setProfileFormLoading(state, { payload }: { payload: boolean }) {
      state.loading = payload
    },
    setProfileFormErrors(state, action) {
      state.loading = false
      state.errors = action.payload
    },
    setProfileFormInfo(state, action) {
      state.loading = false
      state.info = action.payload
    },
  },
})

export const {
  resetProfileForm,
  setProfileFormErrors,
  setProfileFormInfo,
  setProfileFormLoading,
} = profileFormStore.actions
