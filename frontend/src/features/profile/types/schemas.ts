import { z } from "zod"

export const UpdateImageSchema = z.object({
    user_photo: z.union([
        z.instanceof(File),
        z.literal(''),
        z.null(),
        z.undefined()
    ]).refine(file => {
        if (file === null || file === '' || file === undefined) {
            return true;
        }
        if (file instanceof File) {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
            return validTypes.includes(file.type) && file.size <= maxSize;
        }
        return false;
    }, {
        message: 'Photo must be a JPG or PNG file and no larger than 10 MB.'
    }),
})

export const UpdateInformationSchema = z.object({
    username: z.string().min(2),
    first_name: z.string().min(2),
    last_name: z.string().min(2),
    email: z.string().email("Invalid email address"),
})