import { z } from "zod"

import {
  UpdateImageSchema,
  UpdateInformationSchema,
} from "@/features/profile/types"
import { BackendSingleResponse, UserDTO } from "@/types"

export interface UpdateProfileProps {
  user: UserDTO
  onSucess: (
    data:
      | z.infer<typeof UpdateImageSchema>
      | z.infer<typeof UpdateInformationSchema>
  ) => void
}

export interface UpdateImageProps {
  onSuccess: (data: z.infer<typeof UpdateImageSchema>) => void
}

export interface UpdateInformationProps {
  onSuccess: (data: z.infer<typeof UpdateInformationSchema>) => void
}

export interface ProfileFormState {
  loading: boolean
  errors: BackendSingleResponse<string> | null
  info: BackendSingleResponse<string> | null
}
