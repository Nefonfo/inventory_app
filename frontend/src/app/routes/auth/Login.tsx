import { z } from "zod"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { LoginForm } from "@/features/auth/components/LoginForm"
import { LoginDTO, LoginFormSchema } from "@/features/auth/types"
import { authLogin } from "@/features/auth/stores/authActions"
import { AppDispatch, RootState } from "@/stores/store"

export const LoginRoute = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, errors, token, user } = useSelector(
    (state: RootState) => state.auth
  )

  const submitForm = (data: z.TypeOf<typeof LoginFormSchema>) => {
    const submitData = data as LoginDTO
    dispatch(authLogin(submitData))
  }

  useEffect(() => {
    if (token && user) {
      navigate("/dashboard")
    }
  }, [navigate, token])

  return <LoginForm loading={loading} errors={errors} onSuccess={submitForm} />
}
