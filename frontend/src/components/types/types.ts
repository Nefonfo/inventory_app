import { BackendSingleResponse } from "@/types/types";

export interface HeaderProps {
    display_name: string
    user_photo: string | null
    logoutAction: () => void
}

export interface ErrorsHandlerProps {
    errors: BackendSingleResponse<string> | string | null;
}