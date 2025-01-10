import { z } from "zod"
import { useDispatch } from "react-redux"

import { Spinner } from "@/components/ui/spinner"
import { updateUser } from "@/features/auth/stores"
import {
  useProfileQuery,
  useProfileUpdateMutation,
  usePasswordUpdateMutation,
} from "@/features/profile/api"
import {
  resetProfileForm,
  setProfileFormErrors,
  setProfileFormInfo,
  setProfileFormLoading,
} from "@/features/profile/store"
import {
  UpdateImageSchema,
  UpdateInformationSchema,
} from "@/features/profile/types"
import { PasswordDTO, UserDTO } from "@/types"
import { AppDispatch } from "@/stores"

export const useSubmitProfile = (type: "profile" | "password") => {
  const { refetch } = useProfileQuery("")
  const [updateProfile, { isLoading: profileLoading }] =
    useProfileUpdateMutation()
  const [updatePassword, { isLoading: passwordLoading }] =
    usePasswordUpdateMutation()
  const dispatch = useDispatch<AppDispatch>()

  const loadingQuerys = [profileLoading, passwordLoading]

  const LoadingSpinner = () => (
    <Spinner>
      <h6 className="text-slate-750 font-light text-xl">Loading</h6>
    </Spinner>
  )

  const fetch = async (
    data:
      | z.infer<typeof UpdateImageSchema>
      | z.infer<typeof UpdateInformationSchema>
      | PasswordDTO
  ) => {
    dispatch(resetProfileForm())
    dispatch(setProfileFormLoading(true))

    const fetchUpdate =
      type === "profile"
        ? () => updateProfile(data as Partial<UserDTO>).unwrap()
        : () => updatePassword(data as PasswordDTO).unwrap()
    try {
      const result = await fetchUpdate()
      const message =
        type === "profile"
          ? { message: "Information updated successfully" }
          : result
      dispatch(setProfileFormInfo(message))
      if (type === "profile") {
        dispatch(updateUser(result as UserDTO))
        refetch()
      }
    } catch (error) {
      if (error && typeof error === "object" && "data" in error) {
        dispatch(setProfileFormErrors(error.data))
      } else {
        dispatch(setProfileFormErrors(error))
      }
    }
    dispatch(setProfileFormLoading(false))
  }

  return {
    fetch,
    isLoading: loadingQuerys.some((value) => value),
    LoadingSpinner: LoadingSpinner,
  }
}
