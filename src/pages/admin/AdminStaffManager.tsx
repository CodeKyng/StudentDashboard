import { useCallback, useEffect, useMemo, useState } from "react"
import { BookUser, Plus, RefreshCw, Trash2, UserPlus } from "lucide-react"
import { toast } from "sonner"

import { getAuthErrorMessage } from "@/lib/auth"
import {
  listInstitutionCourses,
  listStudentsWithMatric,
  type InstitutionCourse,
  type StudentDirectoryEntry,
} from "@/lib/institution-data"
import {
  assignCourseToStaff,
  enrollStudentInCourse,
  listCourseEnrollments,
  listStaffAssignments,
  removeCourseEnrollment,
  removeStaffAssignment,
  type CourseEnrollment,
  type StaffCourseAssignment,
} from "@/lib/staff-assignments"
import { listDirectory } from "@/lib/admin-data"
import type { UserProfile } from "@/lib/auth"
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
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function AdminStaffManager() {
  const [staffUsers, setStaffUsers] = useState<UserProfile[]>([])
  const [courses, setCourses] = useState<InstitutionCourse[]>([])
  const [students, setStudents] = useState<StudentDirectoryEntry[]>([])
  const [assignments, setAssignments] = useState<StaffCourseAssignment[]>([])
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  const [staffUid, setStaffUid] = useState("")
  const [courseId, setCourseId] = useState("")
  const [enrollCourseCode, setEnrollCourseCode] = useState("")
  const [studentUid, setStudentUid] = useState("")
  const [studentQuery, setStudentQuery] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [users, courseList, studentList, assigns, enrols] =
        await Promise.all([
          listDirectory(),
          listInstitutionCourses(),
          listStudentsWithMatric(),
          listStaffAssignments(),
          listCourseEnrollments(),
        ])
      setStaffUsers(
        users.filter((u) => u.role === "Staff" || u.role === "Admin")
      )
      setCourses(courseList)
      setStudents(studentList.filter((s) => s.role === "Student"))
      setAssignments(assigns)
      setEnrollments(enrols)
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const selectedStaff = staffUsers.find((s) => s.uid === staffUid)
  const selectedCourse = courses.find((c) => c.id === courseId)

  const staffAssignments = useMemo(
    () =>
      staffUid
        ? assignments.filter((a) => a.staffUid === staffUid)
        : assignments,
    [assignments, staffUid]
  )

  const enrollCourse =
    courses.find(
      (c) => c.code.toUpperCase() === enrollCourseCode.toUpperCase()
    ) ?? null

  const courseEnrollmentRows = useMemo(() => {
    if (!enrollCourseCode) return []
    return enrollments.filter(
      (e) => e.courseCode.toUpperCase() === enrollCourseCode.toUpperCase()
    )
  }, [enrollments, enrollCourseCode])

  const enrolledUids = useMemo(
    () => new Set(courseEnrollmentRows.map((e) => e.studentUid)),
    [courseEnrollmentRows]
  )

  const studentCandidates = useMemo(() => {
    const q = studentQuery.trim().toLowerCase()
    return students
      .filter((s) => !enrolledUids.has(s.uid))
      .filter((s) => {
        if (!q) return true
        return (
          s.displayName.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          (s.matricNumber ?? "").toLowerCase().includes(q)
        )
      })
      .slice(0, 50)
  }, [students, enrolledUids, studentQuery])

  async function handleAssignCourse() {
    if (!selectedStaff || !selectedCourse) {
      toast.error("Select a staff member and a course.")
      return
    }
    setBusy(true)
    try {
      await assignCourseToStaff({
        staffUid: selectedStaff.uid,
        staffName: selectedStaff.displayName,
        staffEmail: selectedStaff.email,
        course: selectedCourse,
      })
      toast.success(
        `${selectedCourse.code} assigned to ${selectedStaff.displayName}.`
      )
      setCourseId("")
      await load()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  async function handleRemoveAssignment(id: string) {
    setBusy(true)
    try {
      await removeStaffAssignment(id)
      toast.success("Course unassigned from staff.")
      await load()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  async function handleEnrollStudent() {
    if (!enrollCourse || !studentUid) {
      toast.error("Select a course and a student.")
      return
    }
    const student = students.find((s) => s.uid === studentUid)
    if (!student) return
    setBusy(true)
    try {
      await enrollStudentInCourse({
        studentUid: student.uid,
        studentName: student.displayName,
        studentEmail: student.email,
        matricNumber: student.matricNumber,
        course: enrollCourse,
      })
      toast.success(`${student.displayName} enrolled in ${enrollCourse.code}.`)
      setStudentUid("")
      await load()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  async function handleRemoveEnrollment(id: string) {
    setBusy(true)
    try {
      await removeCourseEnrollment(id)
      toast.success("Student removed from course.")
      await load()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff manager</h1>
          <p className="text-sm text-muted-foreground">
            Assign courses to staff. Enroll students on those courses. Staff only
            see their assigned courses and the enrolled class list.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={() => void load()}
        >
          <RefreshCw className="size-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookUser className="size-4" />
              Assign course to staff
            </CardTitle>
            <CardDescription>
              Promote a user to Staff under Directory first, then attach courses
              here.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="sm-staff">Staff member</Label>
              <select
                id="sm-staff"
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                value={staffUid}
                disabled={loading}
                onChange={(e) => setStaffUid(e.target.value)}
              >
                <option value="">Select staff…</option>
                {staffUsers.map((u) => (
                  <option key={u.uid} value={u.uid}>
                    {u.displayName} · {u.role} · {u.email}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="sm-course">Course</Label>
              <select
                id="sm-course"
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                value={courseId}
                disabled={loading}
                onChange={(e) => setCourseId(e.target.value)}
              >
                <option value="">Select course…</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.title}
                  </option>
                ))}
              </select>
            </div>
            <Button
              type="button"
              disabled={busy || !staffUid || !courseId}
              onClick={() => void handleAssignCourse()}
            >
              <Plus className="size-4" />
              Assign course
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="size-4" />
              Enroll students on a course
            </CardTitle>
            <CardDescription>
              These students appear on the staff roster for that course.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="sm-enroll-course">Course</Label>
              <select
                id="sm-enroll-course"
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                value={enrollCourseCode}
                disabled={loading}
                onChange={(e) => {
                  setEnrollCourseCode(e.target.value)
                  setStudentUid("")
                }}
              >
                <option value="">Select course…</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.code}>
                    {c.code} — {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="sm-student-q">Find student</Label>
              <Input
                id="sm-student-q"
                placeholder="Name, email, or matric…"
                value={studentQuery}
                onChange={(e) => setStudentQuery(e.target.value)}
                disabled={!enrollCourseCode}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="sm-student">Student</Label>
              <select
                id="sm-student"
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                value={studentUid}
                disabled={!enrollCourseCode}
                onChange={(e) => setStudentUid(e.target.value)}
              >
                <option value="">Select student…</option>
                {studentCandidates.map((s) => (
                  <option key={s.uid} value={s.uid}>
                    {s.displayName}
                    {s.matricNumber ? ` · ${s.matricNumber}` : ""} · {s.email}
                  </option>
                ))}
              </select>
            </div>
            <Button
              type="button"
              disabled={busy || !enrollCourseCode || !studentUid}
              onClick={() => void handleEnrollStudent()}
            >
              <UserPlus className="size-4" />
              Enroll student
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff course assignments</CardTitle>
          <CardDescription>
            {staffUid && selectedStaff
              ? `Showing courses for ${selectedStaff.displayName}`
              : "All assignments (filter by selecting a staff member above)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Dept</TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Loading…
                    </TableCell>
                  </TableRow>
                )}
                {!loading && staffAssignments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No course assignments yet.
                    </TableCell>
                  </TableRow>
                )}
                {staffAssignments.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="font-medium">{a.staffName}</div>
                      <div className="text-xs text-muted-foreground">{a.staffEmail}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{a.courseCode}</Badge>
                    </TableCell>
                    <TableCell>{a.courseTitle}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {a.departmentName || "—"}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        disabled={busy}
                        aria-label="Remove assignment"
                        onClick={() => void handleRemoveAssignment(a.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course enrollment</CardTitle>
          <CardDescription>
            {enrollCourseCode
              ? `Students enrolled in ${enrollCourseCode}`
              : "Select a course in the enroll panel to view its class list"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Matric</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {!enrollCourseCode && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Choose a course above to manage enrollments.
                    </TableCell>
                  </TableRow>
                )}
                {enrollCourseCode && courseEnrollmentRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No students enrolled yet.
                    </TableCell>
                  </TableRow>
                )}
                {courseEnrollmentRows.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.studentName}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {e.matricNumber || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {e.studentEmail}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{e.courseCode}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        disabled={busy}
                        aria-label="Remove enrollment"
                        onClick={() => void handleRemoveEnrollment(e.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
