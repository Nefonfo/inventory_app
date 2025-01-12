import { z } from "zod"

export const LoginFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export const RecoverFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

export const RecoverConfirmFormSchema = z.object({
  token: z.string(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})
