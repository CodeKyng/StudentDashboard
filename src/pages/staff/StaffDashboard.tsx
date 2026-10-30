import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  Award,
  CalendarCheck,
  Clock,
  FileText,
  UserPlus,
  Users,
} from "lucide-react"
import { toast } from "sonner"

import { useStaff } from "@/components/staff/staff-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function StaffDashboard() {
  const {
    selectedCourse,
    selectedCourseCode,
    roster,
    rosterStatus,
    students,
    studentsStatus,
    addStudentToCourse,
    adding,
  } = useStaff()

  const [query, setQuery] = useState("")
  const [pickUid, setPickUid] = useState("")

  const onRoster = useMemo(
    () => new Set(roster.map((r) => r.uid)),
    [roster]
  )

  const candidates = useMemo(() => {
    const q = query.trim().toLowerCase()
    return students
      .filter((s) => !onRoster.has(s.uid))
      .filter((s) => {
        if (!q) return true
        return (
          s.displayName.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          (s.matricNumber ?? "").toLowerCase().includes(q)
        )
      })
      .slice(0, 40)
  }, [students, onRoster, query])

  async function handleAdd() {
    if (!pickUid) {
      toast.error("Choose a student to add.")
      return
    }
    await addStudentToCourse(pickUid)
    setPickUid("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Staff dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Select a course, build the student roster, then enter attendance, CA,
          exam scores, assignments, and exam schedules for your class.
        </p>
      </div>

      {!selectedCourseCode && (
        <Card>
          <CardHeader>
            <CardTitle>Get started</CardTitle>
            <CardDescription>
              Use the course selector above. Courses come from the institutional
              catalog managed by Admin.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Typical flow: pick a course → add registered students → open
            Attendance or CA &amp; Exam scores → save.
          </CardContent>
        </Card>
      )}

      {selectedCourse && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Course</CardTitle>
                <Badge variant="outline">{selectedCourse.code}</Badge>
              </CardHeader>
              <CardContent>
                <p className="truncate text-lg font-semibold">
                  {selectedCourse.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedCourse.units} units · {selectedCourse.level || "—"} ·{" "}
                  {selectedCourse.semester || "—"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Roster</CardTitle>
                <Users className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {rosterStatus === "loading" ? "—" : roster.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  Students with this course on record
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Department</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">
                  {selectedCourse.departmentName || "—"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedCourse.facultyName || ""}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Quick links</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button asChild size="sm" variant="outline" className="justify-between">
                  <Link
                    to={`/staff/attendance?course=${encodeURIComponent(selectedCourse.code)}`}
                  >
                    <span className="flex items-center gap-2">
                      <CalendarCheck className="size-4" /> Attendance
                    </span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="justify-between">
                  <Link
                    to={`/staff/scores?course=${encodeURIComponent(selectedCourse.code)}`}
                  >
                    <span className="flex items-center gap-2">
                      <Award className="size-4" /> CA & Exam
                    </span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Add student to roster</CardTitle>
                <CardDescription>
                  Adds results and attendance rows for this course on the
                  student&apos;s dashboard (CA/Exam start at 0).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Search name, email, or matric…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={studentsStatus !== "ready"}
                />
                <select
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  value={pickUid}
                  onChange={(e) => setPickUid(e.target.value)}
                  disabled={studentsStatus !== "ready"}
                >
                  <option value="">
                    {studentsStatus === "loading"
                      ? "Loading students…"
                      : "Select student"}
                  </option>
                  {candidates.map((s) => (
                    <option key={s.uid} value={s.uid}>
                      {s.displayName}
                      {s.matricNumber ? ` · ${s.matricNumber}` : ""} · {s.email}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  disabled={!pickUid || adding || !selectedCourse}
                  onClick={() => void handleAdd()}
                >
                  <UserPlus className="size-4" />
                  {adding ? "Adding…" : "Add to course"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Academic tools</CardTitle>
                <CardDescription>
                  Fill data that appears on each student&apos;s portal.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button asChild variant="outline" className="justify-between">
                  <Link
                    to={`/staff/attendance?course=${encodeURIComponent(selectedCourse.code)}`}
                  >
                    <span className="flex items-center gap-2">
                      <CalendarCheck className="size-4" /> Mark attendance
                    </span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-between">
                  <Link
                    to={`/staff/scores?course=${encodeURIComponent(selectedCourse.code)}`}
                  >
                    <span className="flex items-center gap-2">
                      <Award className="size-4" /> Enter CA & exam scores
                    </span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-between">
                  <Link
                    to={`/staff/assignments?course=${encodeURIComponent(selectedCourse.code)}`}
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="size-4" /> Publish assignment
                    </span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="justify-between">
                  <Link
                    to={`/staff/exams?course=${encodeURIComponent(selectedCourse.code)}`}
                  >
                    <span className="flex items-center gap-2">
                      <Clock className="size-4" /> Set exam schedule
                    </span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Current roster</CardTitle>
              <CardDescription>
                Students who already have this course on their academic record.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Matric</TableHead>
                      <TableHead>Attendance %</TableHead>
                      <TableHead>CA</TableHead>
                      <TableHead>Exam</TableHead>
                      <TableHead>Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rosterStatus === "loading" && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-muted-foreground"
                        >
                          Loading roster…
                        </TableCell>
                      </TableRow>
                    )}
                    {rosterStatus === "ready" && roster.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-muted-foreground"
                        >
                          No students yet. Add students above.
                        </TableCell>
                      </TableRow>
                    )}
                    {roster.map((row) => (
                      <TableRow key={row.uid}>
                        <TableCell>
                          <div className="font-medium">{row.displayName}</div>
                          <div className="text-xs text-muted-foreground">
                            {row.email}
                          </div>
                        </TableCell>
                        <TableCell>{row.matricNumber || "—"}</TableCell>
                        <TableCell>{row.attendancePercentage}</TableCell>
                        <TableCell>{row.ca}</TableCell>
                        <TableCell>{row.exam}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{row.grade}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
