import { z } from "zod"

export const UpdateImageSchema = z.object({
  user_photo: z
    .union([z.instanceof(File), z.literal(""), z.null(), z.undefined()])
    .refine(
      (file) => {
        if (file === null || file === "" || file === undefined) {
          return true
        }
        if (file instanceof File) {
          const validTypes = ["image/jpeg", "image/png", "image/jpg"]
          const maxSize = 10 * 1024 * 1024 // 10 MB in bytes
          return validTypes.includes(file.type) && file.size <= maxSize
        }
        return false
      },
      {
        message: "Photo must be a JPG or PNG file and no larger than 10 MB.",
      }
    ),
})

const alphabeticalRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
export const UpdateInformationSchema = z.object({
  username: z.string().min(2),
  first_name: z.string().min(2).regex(alphabeticalRegex, "First name must contain only letters, spaces, or special characters."),
  last_name: z.string().min(2).regex(alphabeticalRegex, "Last name must contain only letters, spaces, or special characters."),
  email: z.string().email("Invalid email address"),
})

export const UpdatePasswordSchema = z
  .object({
    old_password: z.string().min(8),
    new_password: z.string().min(8),
    new_password_confirm: z.string().min(8),
  })
  .refine((data) => data.new_password === data.new_password_confirm, {
    message: "Passwords must be equal",
    path: ["new_password_confirm"],
  })
  .refine((data) => data.new_password !== data.old_password, {
    message: "New password can't be the same as the old password",
    path: ["new_password"],
  })
