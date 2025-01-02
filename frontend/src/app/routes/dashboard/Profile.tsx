import { z } from "zod"

import { Spinner } from "@/components/ui/spinner"
import { useProfileQuery, useProfileUpdateMutation } from "@/features/profile/api/profileApi"
import { UpdateProfile } from "@/features/profile/components/UpdateProfile"
import { UpdateImageSchema, UpdateInformationSchema } from "@/features/profile/types"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/stores/store"
import { UserDTO } from "@/types/types"
import { updateUser } from "@/features/auth/stores/authStore"
import { resetProfileForm, setProfileFormErrors, setProfileFormInfo, setProfileFormLoading } from "@/features/profile/store/profileFormStore"

export const ProfileRoute = () => {

    const { isLoading, data: user, refetch } = useProfileQuery('')
    const [updateProfile] = useProfileUpdateMutation()
    const dispatch = useDispatch<AppDispatch>()

    const submitForm = async (data: z.infer<typeof UpdateImageSchema> | z.infer<typeof UpdateInformationSchema>) => {
        dispatch(resetProfileForm())
        dispatch(setProfileFormLoading(true))
        const submitData = data as Partial<UserDTO>
        try{
            const result = await updateProfile(submitData).unwrap()
            dispatch(setProfileFormInfo({'message': 'Information updated successfully'}))
            dispatch(updateUser(result))
        } catch (error) {
            if (error && typeof error === 'object' && 'data' in error) {
                dispatch(setProfileFormErrors(error.data))
            } else {
                dispatch(setProfileFormErrors(error))
            }
        }
        dispatch(setProfileFormLoading(false))
        refetch()
    }


    return (user && !isLoading) ? (
        <UpdateProfile user={user} onSucess={submitForm} />
    ) : (
        <Spinner><h6 className="text-slate-750 font-light text-xl">Loading</h6></Spinner>
    )

}
