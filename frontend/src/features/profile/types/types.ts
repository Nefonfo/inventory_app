import { z } from "zod"

import { UserDTO } from "@/types/types"
import { UpdateImageSchema } from "@/features/profile/types"

export interface UpdateProfileProps {
    user: UserDTO,
    onUpdateImage: (data: z.infer<typeof UpdateImageSchema>) => void
}

export interface UpdateImageProps {
    onSuccess: (data: z.infer<typeof UpdateImageSchema>) => void
}
