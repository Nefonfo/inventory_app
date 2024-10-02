import { z } from "zod"

export const UpdateImageSchema = z.object({
    photo: z.instanceof(File).refine(file => {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
        return validTypes.includes(file.type) && file.size <= maxSize;
    }, {
        message: 'Photo must be a JPG or PNG file and no larger than 10 MB.'
    })
})
