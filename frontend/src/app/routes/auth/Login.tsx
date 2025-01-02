import { z } from "zod"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

import { AppDispatch, RootState } from "@/stores/store"
import { AuthLayout } from "@/components/layouts/AuthLayout"
import { LoginForm } from "@/features/auth/components/LoginForm"
import { authLogin } from "@/features/auth/stores/authActions"
import { LoginDTO, LoginFormSchema } from "@/features/auth/types"

export const LoginRoute = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { loading, errors, token, user } = useSelector((state: RootState) => state.auth)

    const submitForm = (data: z.TypeOf<typeof LoginFormSchema>) => {
        const submitData = data as LoginDTO
        dispatch(authLogin(submitData))
    }

    useEffect(() => {
        if (token && user) {
            navigate('/dashboard')
        }
    }, [navigate, token])

    return (
        <AuthLayout>
            <LoginForm loading={loading} errors={errors} onSuccess={submitForm} />
        </AuthLayout>
    )
}
