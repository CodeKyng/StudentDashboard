import { Link } from "react-router-dom"

import { SideBar } from "@/components/layout/SideBar"
import TopBar from "@/components/layout/TopBar"
import { useDashboardContext } from "@/components/Auth/dashboard-context"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Megaphone,
  TrendingDown,
  TrendingUp,
} from "lucide-react"

function StudentDashboard() {
  const { data, identity } = useDashboardContext()
  const formatCurrency = (amount: number | undefined) =>
    amount === undefined
      ? "Not provided"
      : new Intl.NumberFormat(
          "en-NG",
          data.currencyCode
            ? {
                style: "currency",
                currency: data.currencyCode,
                maximumFractionDigits: 2,
              }
            : { maximumFractionDigits: 2 }
        ).format(amount)

  const hasCgpa = data.cgpa !== undefined
  const hasCgpaTrend =
    data.cgpa !== undefined &&
    data.previousCgpa !== undefined &&
    data.previousCgpa !== 0
  const cgpaChange =
    data.cgpa !== undefined && data.previousCgpa !== undefined
      ? data.cgpa - data.previousCgpa
      : undefined
  const cgpaIsIncreasing = cgpaChange !== undefined && cgpaChange >= 0
  const cgpaPercentage =
    cgpaChange !== undefined && data.previousCgpa !== undefined
      ? Math.abs((cgpaChange / data.previousCgpa) * 100)
      : undefined
  const attendanceIsHealthy =
    data.attendancePercentage !== undefined &&
    data.warningPercentage !== undefined &&
    data.attendancePercentage >= data.warningPercentage

  const placementReady = Boolean(
    identity.matricNumber &&
      (identity.facultyName || data.faculty) &&
      (identity.departmentName || data.department)
  )

  return (
    <SidebarProvider>
      <SideBar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <TopBar />
          </div>
        </header>
        <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>CGPA</CardTitle>
              <CardDescription>
                Current Cumulative Grade Point Average
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold">{hasCgpa ? data.cgpa : "—"}</p>
            </CardContent>
            <CardFooter className="gap-2 text-sm font-medium">
              {hasCgpaTrend && (
                <>
                  {cgpaIsIncreasing ? (
                    <TrendingUp className="size-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="size-4 text-destructive" />
                  )}
                  <span
                    className={
                      cgpaIsIncreasing ? "text-emerald-500" : "text-destructive"
                    }
                  >
                    {cgpaIsIncreasing ? "+" : "-"}
                    {cgpaPercentage?.toFixed(1)}%
                  </span>
                  <span className="text-muted-foreground">
                    from last semester
                  </span>
                </>
              )}
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
              <CardDescription>
                Warning threshold: {data.warningPercentage ?? "—"}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold">
                {data.attendancePercentage ?? "—"}
                {data.attendancePercentage === undefined ? "" : "%"}
              </p>
              {data.attendancePercentage !== undefined && (
                <Progress value={data.attendancePercentage} className="mt-4" />
              )}
            </CardContent>
            <CardFooter>
              {data.attendancePercentage !== undefined &&
              data.warningPercentage !== undefined ? (
                <p
                  className={
                    attendanceIsHealthy
                      ? "text-sm font-medium text-emerald-500"
                      : "text-sm font-medium text-destructive"
                  }
                >
                  {attendanceIsHealthy
                    ? "Attendance is above the warning threshold."
                    : "Attendance is below the warning threshold."}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Attendance data is not available.
                </p>
              )}
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Courses</CardTitle>
              <CardDescription>You registered this semester</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold">{data.courses.length}</p>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="h-auto p-0" asChild>
                <Link to="/registercourses">Manage registration</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Fees Status</CardTitle>
              <CardDescription>Current fees status</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {data.feeStatus ?? "Not provided"}
              </p>
            </CardContent>
            <CardFooter>Current status from your account</CardFooter>
          </Card>
        </div>
        <div className="grid gap-4 p-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <BookOpen />
                  My Courses
                </span>
                <Button variant="ghost" asChild>
                  <Link to="/registercourses">
                    Register <ArrowRight />
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <ScrollArea className="h-[450px] w-full rounded-md p-4">
              <CardContent>
                {data.courses.length ? (
                  data.courses.map((course) => (
                    <div key={course.code} className="mb-4">
                      <p className="font-bold">{course.code}</p>
                      <p className="text-lg font-semibold">{course.title}</p>
                      <p className="text-muted-foreground">
                        {course.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>You have not registered any courses yet.</p>
                    {!placementReady ? (
                      <p>
                        Wait until admin assigns your matric, faculty, and
                        department, then open Course registration.
                      </p>
                    ) : data.registrationEligible !== true ? (
                      <p>
                        Placement is set. Registration opens when admin marks
                        you eligible for this session.
                      </p>
                    ) : (
                      <Button asChild>
                        <Link to="/registercourses">Register courses</Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </ScrollArea>
          </Card>
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>School Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-3xl font-bold">
                  {formatCurrency(data.schoolFeeAmount)}
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  {data.session ?? "Academic session not provided"}
                </p>
              </CardContent>
              <CardFooter className="justify-center">
                <Button variant="outline" asChild>
                  <Link to="/school-fees">View fees</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck />
                  Attendance
                </CardTitle>
              </CardHeader>
              <ScrollArea className="h-[300px] w-full rounded-md p-4">
                <CardContent className="space-y-4">
                  {data.attendanceCourses.length ? (
                    data.attendanceCourses.map((course) => (
                      <div
                        key={course.coursecode}
                        className="space-y-2 rounded-lg border border-border bg-background/70 p-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold">{course.coursecode}</p>
                          </div>
                          <span className="text-sm font-medium text-muted-foreground">
                            {course.percentage}%
                          </span>
                        </div>
                        <Progress value={course.progress} />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Attendance appears after you register courses and staff
                      mark the class.
                    </p>
                  )}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
        </div>
        <div className="grid gap-4 p-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone />
                Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.announcements.length ? (
                data.announcements.map((announcement) => (
                  <div key={announcement.id} className="mb-4">
                    <p className="font-bold">{announcement.title}</p>
                    <p className="text-muted-foreground">
                      {announcement.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No announcements are available in Firebase.
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" asChild>
                <Link to="/announcement">View announcements</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.events.length ? (
                data.events.map((event) => (
                  <div key={event.title} className="mb-4">
                    <p className="font-bold">{event.title}</p>
                    <p className="text-muted-foreground">{event.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No events are available in Firebase.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default StudentDashboard
