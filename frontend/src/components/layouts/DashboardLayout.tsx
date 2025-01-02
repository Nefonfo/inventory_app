import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { WrapperComponent } from "@/types/types"
import { Header } from "@/components/custom_ui/Header"
import { logout } from "@/features/auth/stores/authStore"
import { AppDispatch, RootState } from "@/stores/store"

export const DashboardLayout = ({ children }: WrapperComponent) => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { user } = useSelector((state: RootState) => state.auth)
    const display_name = user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : 'Not Name'

    const logoutAction = () => {
        dispatch(logout())
        navigate('/login')
    }

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header
                display_name={display_name}
                user_photo={user && typeof user.user_photo === 'string' ? user.user_photo : null}
                logoutAction={logoutAction}
            />
            <div className="w-full min-h-20 py-4 lg:py-12 px-4 lg:px-12 flex justify-center items-center">
                {children}
            </div>
        </div>
    )
}
