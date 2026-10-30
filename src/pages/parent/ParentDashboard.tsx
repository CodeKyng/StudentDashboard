import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Award,
  BookOpen,
  CalendarCheck,
  Clock,
  CreditCard,
  FileText,
  GraduationCap,
  LogOut,
  Users,
} from "lucide-react"
import { signOut } from "firebase/auth"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAuthErrorMessage } from "@/lib/auth"
import { auth } from "@/lib/firebase"
import {
  listChildrenForParent,
  type ParentLink,
} from "@/lib/parent-invites"
import { getDashboardData, type DashboardData } from "@/lib/dashboard-data"
import { formatGpa } from "@/lib/grades"

export default function ParentDashboard() {
  const { profile } = useDashboardContext()
  const navigate = useNavigate()
  const [links, setLinks] = useState<ParentLink[]>([])
  const [snapshots, setSnapshots] = useState<
    Record<string, DashboardData | null>
  >({})
  const [selectedUid, setSelectedUid] = useState("")
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
      if (children.length > 0) {
        setSelectedUid((prev) =>
          prev && children.some((c) => c.studentUid === prev)
            ? prev
            : children[0].studentUid
        )
      }
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
    navigate("/", { replace: true })
  }

  const selectedLink = links.find((l) => l.studentUid === selectedUid)
  const snap = selectedUid ? snapshots[selectedUid] : null

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
              {profile.displayName} · {profile.email}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void handleLogout()}
            >
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
            Passwordless access via invite email. You only see students who
            invited your email.
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
                Ask your child to open Guardians and send a sign-in link to{" "}
                {profile.email}. Open that email link — no password required.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {links.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {links.map((link) => (
              <Button
                key={link.id}
                type="button"
                size="sm"
                variant={selectedUid === link.studentUid ? "default" : "outline"}
                onClick={() => setSelectedUid(link.studentUid)}
              >
                {link.studentName}
              </Button>
            ))}
          </div>
        )}

        {selectedLink && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="size-4" />
                  {selectedLink.studentName}
                </CardTitle>
                <CardDescription>Full academic snapshot</CardDescription>
              </CardHeader>
              <CardContent>
                {snap ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">CGPA</p>
                      <p className="text-2xl font-bold">{formatGpa(snap.cgpa)}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Level / session</p>
                      <p className="text-lg font-semibold">
                        {snap.level ?? "—"} · {snap.session ?? "—"}
                      </p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Attendance</p>
                      <p className="text-2xl font-bold">
                        {snap.attendancePercentage ?? "—"}%
                      </p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Fees</p>
                      <p className="text-lg font-semibold">
                        {snap.feeStatus ?? "—"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Academic record not published yet.
                  </p>
                )}
                {snap && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {snap.department ?? "—"} · {snap.faculty ?? "—"} ·{" "}
                    {snap.currentSemester ?? ""}
                  </p>
                )}
              </CardContent>
            </Card>

            {snap && snap.results.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Award className="size-4" />
                    Results (CA & Exam)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Units</TableHead>
                          <TableHead>CA</TableHead>
                          <TableHead>Exam</TableHead>
                          <TableHead>Grade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {snap.results.map((r, i) => (
                          <TableRow key={`${r.code}-${i}`}>
                            <TableCell className="font-mono text-sm">
                              {r.code}
                            </TableCell>
                            <TableCell>{r.course}</TableCell>
                            <TableCell>{r.units}</TableCell>
                            <TableCell>{r.ca}</TableCell>
                            <TableCell>{r.exam}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{r.grade}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {snap && snap.attendanceCourses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CalendarCheck className="size-4" />
                    Attendance by course
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>%</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {snap.attendanceCourses.map((a, i) => (
                          <TableRow key={`${a.coursecode}-${i}`}>
                            <TableCell className="font-mono text-sm">
                              {a.coursecode}
                            </TableCell>
                            <TableCell>{a.progress}</TableCell>
                            <TableCell>{a.percentage}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {snap && snap.exams.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="size-4" />
                    Exam schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Hall</TableHead>
                          <TableHead>Seat</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {snap.exams.map((e, i) => (
                          <TableRow key={`${e.course}-${i}`}>
                            <TableCell>{e.course}</TableCell>
                            <TableCell>{e.date}</TableCell>
                            <TableCell>{e.time}</TableCell>
                            <TableCell>{e.hall}</TableCell>
                            <TableCell>{e.seatNo}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {snap && snap.assignments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="size-4" />
                    Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Due</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {snap.assignments.map((a, i) => (
                          <TableRow key={`${a.title}-${i}`}>
                            <TableCell>{a.course}</TableCell>
                            <TableCell>{a.title}</TableCell>
                            <TableCell>{a.dueDate}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{a.status}</Badge>
                            </TableCell>
                            <TableCell>{a.score}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {snap && snap.courses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="size-4" />
                    Registered courses
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {snap.courses.map((c, i) => (
                    <Badge key={`${c.code}-${i}`} variant="secondary">
                      {c.code} — {c.title}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}

            {snap && snap.paymentRecords.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CreditCard className="size-4" />
                    Fee payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Session</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>RRR</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {snap.paymentRecords.map((p, i) => (
                          <TableRow key={`${p.rrr}-${i}`}>
                            <TableCell>{p.session}</TableCell>
                            <TableCell>{p.level}</TableCell>
                            <TableCell>{p.date}</TableCell>
                            <TableCell className="font-mono text-sm">
                              {p.rrr}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{p.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground">
          <Link to="/" className="underline underline-offset-4">
            Back to site
          </Link>
        </p>
      </main>
    </div>
  )
}
