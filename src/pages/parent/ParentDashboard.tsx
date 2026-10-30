import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { GraduationCap, LogOut, Users } from "lucide-react"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"

import { useDashboardContext } from "@/components/Auth/dashboard-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getAuthErrorMessage } from "@/lib/auth"
import { auth } from "@/lib/firebase"
import {
  listChildrenForParent,
  type ParentLink,
} from "@/lib/parent-invites"
import { getDashboardData, type DashboardData } from "@/lib/dashboard-data"

export default function ParentDashboard() {
  const { profile } = useDashboardContext()
  const navigate = useNavigate()
  const [links, setLinks] = useState<ParentLink[]>([])
  const [snapshots, setSnapshots] = useState<
    Record<string, DashboardData | null>
  >({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const children = await listChildrenForParent(profile.uid)
      setLinks(children)
      const entries = await Promise.all(
        children.map(async (link) => {
          try {
            const data = await getDashboardData(link.studentUid)
            return [link.studentUid, data] as const
          } catch {
            return [link.studentUid, null] as const
          }
        })
      )
      setSnapshots(Object.fromEntries(entries))
    } catch (err) {
      setError(getAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [profile.uid])

  useEffect(() => {
    void load()
  }, [load])

  async function handleLogout() {
    await signOut(auth)
    navigate("/login", { replace: true })
  }

  return (
    <div className="min-h-svh bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img src="/unijos_logo.png" alt="" className="size-7" />
            <div>
              <p className="text-sm font-semibold leading-tight">
                University of Jos
              </p>
              <p className="text-xs text-muted-foreground">Parent portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {profile.displayName}
            </span>
            <Button type="button" variant="outline" size="sm" onClick={() => void handleLogout()}>
              <LogOut className="size-4" />
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your students</h1>
          <p className="text-sm text-muted-foreground">
            You only see students who invited your email and whom you accepted.
            Open another invite link to add more children to this same account.
          </p>
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        {loading && (
          <p className="text-sm text-muted-foreground">Loading linked students…</p>
        )}

        {!loading && links.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-4" />
                No students linked yet
              </CardTitle>
              <CardDescription>
                Ask your child to open Guardians in their student portal and
                send an invite to {profile.email}. Use that link to connect —
                do not use the public signup page.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {links.map((link) => {
            const snap = snapshots[link.studentUid]
            return (
              <Card key={link.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="size-4" />
                    {link.studentName}
                  </CardTitle>
                  <CardDescription>Linked via guardian invite</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {snap ? (
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        CGPA: {snap.cgpa ?? "—"}
                      </Badge>
                      <Badge variant="secondary">
                        Level: {snap.level ?? "—"}
                      </Badge>
                      <Badge variant="secondary">
                        Session: {snap.session ?? "—"}
                      </Badge>
                      <Badge variant="secondary">
                        Fees: {snap.feeStatus ?? "—"}
                      </Badge>
                      <Badge variant="secondary">
                        Attendance: {snap.attendancePercentage ?? "—"}%
                      </Badge>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Academic record not available yet (admin may still need
                      to publish the student dashboard).
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Department: {snap?.department ?? "—"} · Faculty:{" "}
                    {snap?.faculty ?? "—"}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          <Link to="/" className="underline underline-offset-4">
            Back to site
          </Link>
        </p>
      </main>
    </div>
  )
}
