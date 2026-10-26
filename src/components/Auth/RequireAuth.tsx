import { useEffect, useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { onAuthStateChanged, signOut } from "firebase/auth"

import { getAuthErrorMessage, getUserProfile } from "@/lib/auth"
import { getDashboardData } from "@/lib/dashboard-data"
import {
  DashboardContext,
  type DashboardContextValue,
} from "@/components/Auth/dashboard-context"
import { auth } from "@/lib/firebase"

type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "error"

export function RequireAuth() {
  const [status, setStatus] = useState<AuthStatus>("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const [contextValue, setContextValue] =
    useState<DashboardContextValue | null>(null)
  const location = useLocation()

  useEffect(() => {
    let active = true

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!active) return

      if (!user) {
        setStatus("unauthenticated")
        return
      }

      setStatus("loading")
      try {
        const profile = await getUserProfile(user.uid)
        if (!active) return

        if (!profile) {
          await signOut(auth)
          if (!active) return
          setStatus("unauthenticated")
          return
        }

        const data = await getDashboardData(user.uid)
        if (!active) return
        setContextValue({ profile, data })
        setStatus("authenticated")
      } catch (error) {
        if (!active) return
        setErrorMessage(getAuthErrorMessage(error))
        setStatus("error")
      }
    })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  if (status === "loading") {
    return (
      <main className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Verifying your account...
      </main>
    )
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (status === "error") {
    return (
      <main className="flex min-h-svh items-center justify-center p-6 text-center text-sm text-destructive">
        {errorMessage}
      </main>
    )
  }

  if (!contextValue) return null

  return (
    <DashboardContext.Provider value={contextValue}>
      <Outlet />
    </DashboardContext.Provider>
  )
}
