import { z } from "zod"

import { BackendSingleResponse, UserDTO } from "@/types/types"
import { UpdateImageSchema, UpdateInformationSchema } from "@/features/profile/types"

export interface UpdateProfileProps {
    user: UserDTO,
    onSucess: (data: z.infer<typeof UpdateImageSchema> | z.infer<typeof UpdateInformationSchema>) => void
}

export interface UpdateImageProps {
    onSuccess: (data: z.infer<typeof UpdateImageSchema>) => void
}

export interface UpdateInformationProps {
    onSuccess: (data: z.infer<typeof UpdateInformationSchema>) => void
}

export interface ProfileFormState {
    loading: boolean,
    errors: BackendSingleResponse<string> | null,
    info: BackendSingleResponse<string> | null
}