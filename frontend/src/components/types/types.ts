import { BackendSingleResponse } from "@/types"

export interface HeaderProps {
  display_name: string
  user_photo: string | null
  logoutAction: () => void
}

export interface AlertsHandlerProps {
  data: BackendSingleResponse<string> | string | null
  alert_type?: "default" | "destructive"
}
