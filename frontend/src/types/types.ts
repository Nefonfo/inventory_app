// Generic Types
export type BackendSingleResponse<T> = Record<string, T>

export interface UserDTO {
  username: string
  email: string
  first_name: string
  last_name: string
  user_photo: string | File
}

export interface PasswordDTO {
  old_password: string,
  new_password: string
}

export interface BackendPaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T | null
}

export interface WrapperComponent {
  children: React.ReactNode
}
