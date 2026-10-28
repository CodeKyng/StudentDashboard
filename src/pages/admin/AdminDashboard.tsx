import { Link } from "react-router-dom"
import {
  BookOpen,
  CreditCard,
  GraduationCap,
  Users,
} from "lucide-react"

import { useAdminRecord } from "@/components/admin/admin-context"
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

  const students = users.filter((user) => user.role === "Student")
  const staff = users.filter((user) => user.role === "Staff" || user.role === "Admin")
  const parents = users.filter((user) => user.role === "Parent")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin overview</h1>
        <p className="text-sm text-muted-foreground">
          Manage student records, academics, fees, and campus services.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {directoryStatus === "ready" ? students.length : "—"}
            </p>
            <p className="text-xs text-muted-foreground">Registered student accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff / Admin</CardTitle>
            <GraduationCap className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {directoryStatus === "ready" ? staff.length : "—"}
            </p>
            <p className="text-xs text-muted-foreground">Operator accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parents</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {directoryStatus === "ready" ? parents.length : "—"}
            </p>
            <p className="text-xs text-muted-foreground">Parent portal accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selected record</CardTitle>
            <BookOpen className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="truncate text-lg font-semibold">
              {selectedProfile?.displayName ?? "None selected"}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedProfile?.email ?? "Pick a student above to edit"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Jump to the most common admin workflows.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to="/admin/students">Open directory</Link>
            </Button>
            <Button asChild variant="outline" disabled={!selectedUid}>
              <Link to={selectedUid ? `/admin/profile?student=${selectedUid}` : "#"}>
                Edit profile
              </Link>
            </Button>
            <Button asChild variant="outline" disabled={!selectedUid}>
              <Link to={selectedUid ? `/admin/courses?student=${selectedUid}` : "#"}>
                Manage courses
              </Link>
            </Button>
            <Button asChild variant="outline" disabled={!selectedUid}>
              <Link to={selectedUid ? `/admin/fees?student=${selectedUid}` : "#"}>
                Update fees
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="size-4" />
              Selected student snapshot
            </CardTitle>
            <CardDescription>
              Summary of the currently loaded dashboard record.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {!selectedUid || !draft ? (
              <p className="text-muted-foreground">
                Select a student to preview CGPA, attendance, fees, and course counts.
              </p>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    CGPA: {draft.cgpa ?? "—"}
                  </Badge>
                  <Badge variant="secondary">
                    Attendance: {draft.attendancePercentage ?? "—"}%
                  </Badge>
                  <Badge variant="secondary">
                    Fees: {draft.feeStatus ?? "—"}
                  </Badge>
                  <Badge variant="secondary">
                    Courses: {draft.courses.length}
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  {draft.level ?? "Level not set"} · {draft.session ?? "Session not set"} ·{" "}
                  {draft.department ?? "Department not set"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
