import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  BookOpen,
  Building2,
  GraduationCap,
  IdCard,
  Users,
  ArrowRight,
} from "lucide-react"

import { useAdminRecord } from "@/components/admin/admin-context"
import {
  listDepartments,
  listFaculties,
  listInstitutionCourses,
  listStudentsWithMatric,
} from "@/lib/institution-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminDashboard() {
  const { users, directoryStatus, selectedProfile, selectedUid, draft } =
    useAdminRecord()

  const [counts, setCounts] = useState({
    faculties: 0,
    departments: 0,
    courses: 0,
    students: 0,
    awaitingMatric: 0,
  })
  const [loadingCounts, setLoadingCounts] = useState(true)

  const loadCounts = useCallback(async () => {
    setLoadingCounts(true)
    try {
      const [faculties, departments, courses, directory] = await Promise.all([
        listFaculties(),
        listDepartments(),
        listInstitutionCourses(),
        listStudentsWithMatric(),
      ])
      const students = directory.filter((u) => u.role === "Student")
      setCounts({
        faculties: faculties.length,
        departments: departments.length,
        courses: courses.length,
        students: students.length,
        awaitingMatric: students.filter((s) => !s.matricNumber).length,
      })
    } catch {
      // Individual pages surface errors.
    } finally {
      setLoadingCounts(false)
    }
  }, [])

  useEffect(() => {
    void loadCounts()
  }, [loadCounts])

  const staff = users.filter(
    (user) => user.role === "Staff" || user.role === "Admin"
  )
  const parents = users.filter((user) => user.role === "Parent")
  const n = (value: number) => (loadingCounts ? "—" : value)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin overview</h1>
        <p className="text-sm text-muted-foreground">
          Structure the university (faculties → departments → courses), assign
          matric numbers, then manage individual student records.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faculties</CardTitle>
            <Building2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{n(counts.faculties)}</p>
            <p className="text-xs text-muted-foreground">Institutional structure</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <GraduationCap className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{n(counts.departments)}</p>
            <p className="text-xs text-muted-foreground">Under faculties</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <BookOpen className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{n(counts.courses)}</p>
            <p className="text-xs text-muted-foreground">Catalog with credit units</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{n(counts.students)}</p>
            <p className="text-xs text-muted-foreground">
              {loadingCounts
                ? "…"
                : counts.awaitingMatric > 0
                  ? `${counts.awaitingMatric} awaiting matric`
                  : "All matriculated"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Core admin workflows</CardTitle>
            <CardDescription>
              Typical order: structure the university, publish courses, then
              assign matric numbers and edit student records.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild variant="outline" className="justify-between">
              <Link to="/admin/faculties">
                <span className="flex items-center gap-2">
                  <Building2 className="size-4" />
                  Create faculties
                </span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link to="/admin/departments">
                <span className="flex items-center gap-2">
                  <GraduationCap className="size-4" />
                  Create departments
                </span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link to="/admin/courses">
                <span className="flex items-center gap-2">
                  <BookOpen className="size-4" />
                  Create courses (units & description)
                </span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-between">
              <Link to="/admin/students">
                <span className="flex items-center gap-2">
                  <IdCard className="size-4" />
                  Assign matric numbers
                </span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accounts snapshot</CardTitle>
            <CardDescription>Users in Firebase Auth / users collection.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                Students:{" "}
                {directoryStatus === "ready"
                  ? users.filter((u) => u.role === "Student").length
                  : "—"}
              </Badge>
              <Badge variant="secondary">
                Staff / Admin: {directoryStatus === "ready" ? staff.length : "—"}
              </Badge>
              <Badge variant="secondary">
                Parents: {directoryStatus === "ready" ? parents.length : "—"}
              </Badge>
            </div>
            <div className="rounded-lg border bg-muted/40 p-3">
              <p className="text-xs font-medium text-muted-foreground">Selected student record</p>
              <p className="mt-1 truncate font-semibold">
                {selectedProfile?.displayName ?? "None selected"}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedProfile?.email ??
                  "Pick a student from Directory to edit profile, courses, fees…"}
              </p>
              {selectedUid && draft && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant="outline">CGPA: {draft.cgpa ?? "—"}</Badge>
                  <Badge variant="outline">Attendance: {draft.attendancePercentage ?? "—"}%</Badge>
                  <Badge variant="outline">Courses: {draft.courses.length}</Badge>
                </div>
              )}
              {selectedUid && (
                <Button asChild size="sm" className="mt-3" variant="secondary">
                  <Link to={`/admin/profile?student=${encodeURIComponent(selectedUid)}`}>
                    Edit profile
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How admin work fits together</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-4">
          <div className="rounded-lg border p-3">
            <p className="font-medium text-foreground">1. Faculties</p>
            <p className="mt-1">Top-level academic units (e.g. Natural Sciences, Education).</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="font-medium text-foreground">2. Departments</p>
            <p className="mt-1">Nested under a faculty (e.g. Computer Science, Mathematics).</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="font-medium text-foreground">3. Courses</p>
            <p className="mt-1">Code, title, description, and credit units, linked to a department.</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="font-medium text-foreground">4. Students</p>
            <p className="mt-1">
              Assign matric numbers and place each student in a department, then manage their dashboard record.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
