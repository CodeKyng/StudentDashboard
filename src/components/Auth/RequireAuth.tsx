import { useCallback, useEffect, useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { onAuthStateChanged, signOut } from "firebase/auth"

import { getAuthErrorMessage, getUserProfile } from "@/lib/auth"
import type { DashboardData } from "@/lib/dashboard-data"
import { loadStudentView, type StudentIdentity } from "@/lib/student-data"
import {
  DashboardContext,
  type DashboardContextValue,
} from "@/components/Auth/dashboard-context"
import { auth } from "@/lib/firebase"
import type { UserProfile } from "@/lib/auth"

type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "error"

export function RequireAuth() {
  const [status, setStatus] = useState<AuthStatus>("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [identity, setIdentity] = useState<StudentIdentity>({})
  const [data, setDataState] = useState<DashboardData | null>(null)
  const location = useLocation()

  const applyView = useCallback(async (userProfile: UserProfile) => {
    const view = await loadStudentView(userProfile)
    setProfile(view.profile)
    setIdentity(view.identity)
    setDataState(view.data)
  }, [])

  const refresh = useCallback(async () => {
    const user = auth.currentUser
    if (!user) return
    const nextProfile = await getUserProfile(user.uid)
    if (!nextProfile) {
      await signOut(auth)
      return
    }
    await applyView(nextProfile)
  }, [applyView])

  useEffect(() => {
    let active = true

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!active) return

      if (!user) {
        setStatus("unauthenticated")
        setProfile(null)
        setDataState(null)
        setIdentity({})
        return
      }

      setStatus("loading")
      try {
        const userProfile = await getUserProfile(user.uid)
        if (!active) return

        if (!userProfile) {
          await signOut(auth)
          if (!active) return
          setStatus("unauthenticated")
          return
        }

        const view = await loadStudentView(userProfile)
        if (!active) return
        setProfile(view.profile)
        setIdentity(view.identity)
        setDataState(view.data)
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
        Loading your dashboard…
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

  if (!profile || !data) return null

  const setData: DashboardContextValue["setData"] = (next) => {
    setDataState((prev) => {
      if (!prev) return prev
      return typeof next === "function" ? next(prev) : next
    })
  }

  const value: DashboardContextValue = {
    profile,
    identity,
    data,
    refresh,
    setData,
  }

  return (
    <DashboardContext.Provider value={value}>
      <Outlet />
    </DashboardContext.Provider>
  )
}
