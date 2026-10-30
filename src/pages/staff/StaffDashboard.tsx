import { Link } from "react-router-dom"
import {
  ArrowRight,
  Award,
  CalendarCheck,
  Clock,
  FileText,
  Users,
} from "lucide-react"

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
    courses,
    coursesStatus,
    roster,
    rosterStatus,
  } = useStaff()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Staff dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Courses assigned to you by Admin. Class lists fill automatically when
          students register those courses themselves.
        </p>
      </div>

      {coursesStatus === "ready" && courses.length === 0 && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No courses assigned</CardTitle>
            <CardDescription>
              An administrator must assign you courses under Staff manager
              before you can mark attendance or scores.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {!selectedCourseCode && courses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Select a course</CardTitle>
            <CardDescription>
              Use the course selector in the top bar. Your roster shows students
              who completed Course registration for that unit.
            </CardDescription>
          </CardHeader>
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
                  Self-registered students
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

          <Card>
            <CardHeader>
              <CardTitle>Academic tools</CardTitle>
              <CardDescription>
                Work the class list below — data appears on each student portal.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2">
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

          <Card>
            <CardHeader>
              <CardTitle>Class list</CardTitle>
              <CardDescription>
                Students who registered for {selectedCourse.code} themselves.
                Empty until registration is submitted on the student portal.
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
                          No students have registered this course yet.
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
