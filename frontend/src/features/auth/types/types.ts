import { z } from "zod"

import { LoginFormSchema } from "@/features/auth/types"
import { BackendSingleResponse, UserDTO } from "@/types/types"

// Generic Types

// DTOS
export interface LoginDTO {
    username: string
    password: string
}

// Specific Types
export interface AuthState {
    loading: boolean
    token: string | null
    errors: BackendSingleResponse<string> | null
    user: UserDTO | null
}

export type LoginFormProps = {
    onSuccess: (data: z.infer<typeof LoginFormSchema>) => void
    loading: boolean
    errors: BackendSingleResponse<string> | null
}

export interface LoginResponse {
    token: string
    user: UserDTO
}
