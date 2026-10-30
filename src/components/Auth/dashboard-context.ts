import { createContext, useContext } from "react"

import type { UserProfile } from "@/lib/auth"
import type { DashboardData } from "@/lib/dashboard-data"
import type { StudentIdentity } from "@/lib/student-data"

export interface DashboardContextValue {
  profile: UserProfile
  identity: StudentIdentity
  data: DashboardData
  refresh: () => Promise<void>
  setData: (next: DashboardData | ((prev: DashboardData) => DashboardData)) => void
}

export const DashboardContext = createContext<DashboardContextValue | null>(
  null
)

export function useDashboardContext(): DashboardContextValue {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error(
      "Dashboard context is only available on authenticated routes."
    )
  }
  return context
}
