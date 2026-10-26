import { SideBar } from "@/components/layout/SideBar"
import TopBar from "@/components/layout/TopBar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { NotebookPen } from "lucide-react"
import { useDashboardContext } from "@/components/Auth/dashboard-context"

function AttendanceView() {
  const { data } = useDashboardContext()

  return (
    <SidebarProvider>
      <SideBar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <TopBar />
          </div>
        </header>
        <div className="flex w-full items-stretch gap-4 p-4">
          <Card className="flex-1">
            <CardHeader className="flex items-center gap-2 border-b">
              <NotebookPen />
              Attendance
            </CardHeader>
            <CardContent className="flex max-h-[calc(100vh-160px)] max-w-full flex-col gap-4">
              <ScrollArea className="h-[calc(100vh-220px)] w-full rounded-md border p-4">
                {data.attendanceCourses.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No attendance records are available in Firebase.
                  </p>
                )}
                {data.attendanceCourses.map((course) => (
                  <div
                    key={course.coursecode}
                    className="flex flex-col gap-2 rounded-md border p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-sm font-semibold">
                        {course.coursecode}
                      </h3>
                      <Badge variant="outline">{course.percentage}%</Badge>
                    </div>
                    <Progress value={course.progress} className="w-full" />
                    <p className="text-sm text-muted-foreground">
                      Progress: {course.progress}%
                    </p>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AttendanceView
