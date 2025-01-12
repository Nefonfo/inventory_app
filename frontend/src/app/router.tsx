import {
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom"

import {
  LoginRoute,
  PrivateRoute,
  RecoverRoute,
  RecoverConfirmRoute,
} from "@/app/routes/auth"
import { DashboardRoute, ProfileRoute } from "@/app/routes/dashboard"
import { LandingRoute } from "@/app/routes/landing"
import { AuthLayout, DashboardLayout } from "@/components/layouts"

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<LandingRoute />} />
      <Route path="auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<LoginRoute />} />
        <Route path="recover" element={<Outlet />}>
          <Route index element={<Navigate to="password" />} />
          <Route path="password" element={<RecoverRoute />} />
          <Route path="confirm/:token" element={<RecoverConfirmRoute />} />
        </Route>
      </Route>
      <Route
        path="dashboard"
        element={
          <DashboardLayout>
            <PrivateRoute />
          </DashboardLayout>
        }
      >
        <Route index element={<DashboardRoute />} />
        <Route path="profile" element={<ProfileRoute />} />
      </Route>
    </Route>
  )
)

export const AppRouter = () => {
  return <RouterProvider router={router} />
}
