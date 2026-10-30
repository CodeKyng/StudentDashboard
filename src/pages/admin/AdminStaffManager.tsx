import { useCallback, useEffect, useMemo, useState } from "react"
import { BookUser, Plus, RefreshCw, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { getAuthErrorMessage } from "@/lib/auth"
import {
  listInstitutionCourses,
  type InstitutionCourse,
} from "@/lib/institution-data"
import {
  assignCourseToStaff,
  listStaffAssignments,
  removeStaffAssignment,
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
  const [assignments, setAssignments] = useState<StaffCourseAssignment[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  const [staffUid, setStaffUid] = useState("")
  const [courseId, setCourseId] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [users, courseList, assigns] = await Promise.all([
        listDirectory(),
        listInstitutionCourses(),
        listStaffAssignments(),
      ])
      setStaffUsers(
        users.filter((u) => u.role === "Staff" || u.role === "Admin")
      )
      setCourses(courseList)
      setAssignments(assigns)
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
        `${selectedCourse.code} assigned to ${selectedStaff.displayName}. Students who register that course will appear on their roster.`
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff manager</h1>
          <p className="text-sm text-muted-foreground">
            Assign which courses each staff member teaches. Students register
            themselves for courses; staff then see those self-enrolled students
            on their class list.
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

      <Card className="border-dashed bg-muted/20">
        <CardContent className="py-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Students enroll themselves</strong>{" "}
          under Course registration after matric / faculty / department and
          registration eligibility are set. Admin does not add students to
          courses here.
        </CardContent>
      </Card>

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
        <CardContent className="grid max-w-xl gap-3">
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
    </div>
  )
}
