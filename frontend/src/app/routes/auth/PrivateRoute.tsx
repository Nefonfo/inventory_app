import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useNavigate } from "react-router-dom"

import { logout } from "@/features/auth/stores/authStore"
import { AppDispatch, RootState } from "@/stores/store"

export const PrivateRoute = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { token, user } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        if (!token || !user) {
            dispatch(logout())
            navigate('/login')
        }
    }, [navigate, token])

    return <Outlet />
}
