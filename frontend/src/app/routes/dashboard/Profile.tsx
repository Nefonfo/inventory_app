import { z } from "zod"
import { useDispatch, useSelector } from "react-redux"

import { Spinner } from "@/components/ui/spinner"
import { AlertsHandler } from "@/components/custom_ui"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { updateUser } from "@/features/auth/stores"
import { UpdateImage, UpdateInformation } from "@/features/profile/components"
import {
  useProfileQuery,
  useProfileUpdateMutation,
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
import { getInitials } from "@/lib/utils"
import { RootState, AppDispatch } from "@/stores"
import { UserDTO } from "@/types"

export const ProfileRoute = () => {
  const { errors, info } = useSelector((state: RootState) => state.profileForm)
  const { isLoading, data: user, refetch } = useProfileQuery("")
  const [updateProfile] = useProfileUpdateMutation()
  const dispatch = useDispatch<AppDispatch>()

  const submitForm = async (
    data:
      | z.infer<typeof UpdateImageSchema>
      | z.infer<typeof UpdateInformationSchema>
  ) => {
    dispatch(resetProfileForm())
    dispatch(setProfileFormLoading(true))
    const submitData = data as Partial<UserDTO>
    try {
      const result = await updateProfile(submitData).unwrap()
      dispatch(
        setProfileFormInfo({ message: "Information updated successfully" })
      )
      dispatch(updateUser(result))
      refetch()
    } catch (error) {
      if (error && typeof error === "object" && "data" in error) {
        dispatch(setProfileFormErrors(error.data))
      } else {
        dispatch(setProfileFormErrors(error))
      }
    }
    dispatch(setProfileFormLoading(false))
  }

  const display_name =
    user && user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : "Not Name"

  return user && !isLoading ? (
    <div className="w-full flex flex-col gap-y-10 items-center justify-center">
      <div className="max-w-[1000px] w-full flex flex-col gap-y-5">
        <AlertsHandler data={errors} alert_type="destructive" />
        <AlertsHandler data={info} />
      </div>
      <div className="max-w-[800px] w-full flex flex-col md:flex-row gap-x-8 gap-y-4 items-center">
        <Avatar className="w-20 h-20 md:w-32 md:h-32">
          <AvatarImage
            src={`${import.meta.env.VITE_BACKEND_URL}${user.user_photo}`}
          />
          <AvatarFallback className="text-xl md:text-3xl">
            {getInitials(display_name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-y-3 justify-center items-center md:items-start">
          <h1 className="text-center md:text-start text-3xl dark:text-slate-50">
            Welcome Back, <span className="font-bold">{display_name}</span>
          </h1>
          <UpdateImage onSuccess={submitForm} />
        </div>
      </div>
      <Tabs defaultValue="general" className="w-full lg:w-3/4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General Information</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <UpdateInformation onSuccess={submitForm} />
        </TabsContent>
        <TabsContent value="password">
          <h1>password</h1>
        </TabsContent>
      </Tabs>
    </div>
  ) : (
    <Spinner>
      <h6 className="text-slate-750 font-light text-xl">Loading</h6>
    </Spinner>
  )
}
