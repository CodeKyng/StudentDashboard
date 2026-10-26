import { Navigate, Outlet } from "react-router-dom"

import { useDashboardContext } from "@/components/Auth/dashboard-context"
import type { UserRole } from "@/lib/auth"
import { homePathForRole } from "@/lib/roles"

export function RequireRole({ allow }: { allow: readonly UserRole[] }) {
  const { profile } = useDashboardContext()

  if (!allow.includes(profile.role)) {
    return <Navigate to={homePathForRole(profile.role)} replace />
  }

  return <Outlet />
}
