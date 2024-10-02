import { z } from "zod"

import { Spinner } from "@/components/ui/spinner"
import { useProfileQuery } from "@/features/profile/api/profileApi"
import { UpdateProfile } from "@/features/profile/components/UpdateProfile"
import { UpdateImageSchema } from "@/features/profile/types"

export const ProfileRoute = () => {

    const { isLoading, isError, data: user } = useProfileQuery('')

    const submitImageForm = (data: z.TypeOf<typeof UpdateImageSchema>) => {
        console.log('LISTO PARA EL DISPATCH')
    }


    return (user && !isLoading) ? (
        <UpdateProfile user={user} onUpdateImage={submitImageForm} />
    ) : (
        <Spinner><h6 className="text-slate-750 font-light text-xl">Loading</h6></Spinner>
    )

}
