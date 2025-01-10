import { BackendSingleResponse } from "@/types"

export interface ProfileFormState {
  loading: boolean
  errors: BackendSingleResponse<string> | null
  info: BackendSingleResponse<string> | null
}
