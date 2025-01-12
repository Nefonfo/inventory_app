import axios, { isAxiosError } from "axios"
import { createAsyncThunk } from "@reduxjs/toolkit"

import { LoginDTO, LoginResponse } from "@/features/auth/types"
import { BackendSingleResponse } from "@/types"

export const authLogin = createAsyncThunk<
  LoginResponse | BackendSingleResponse<string>,
  LoginDTO
>(
  "auth/login",
  async ({ username, password }: LoginDTO, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/login/`,
        { username, password }
      )
      return response.data
    } catch (error) {
      return rejectWithValue(
        isAxiosError(error) && error.response
          ? error.response.data
          : { error: "Not axios" }
      )
    }
  }
)
