import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom"

import { LoginRoute, PrivateRoute } from "@/app/routes/auth"
import { DashboardRoute, ProfileRoute } from "@/app/routes/dashboard"
import { LandingRoute } from "@/app/routes/landing"
import { DashboardLayout } from "@/components/layouts"

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<LandingRoute />} />
      <Route path="login" element={<LoginRoute />} />
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
