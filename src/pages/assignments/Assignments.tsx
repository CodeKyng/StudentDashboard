import { SideBar } from "@/components/layout/SideBar"
import TopBar from "@/components/layout/TopBar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pen } from "lucide-react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useDashboardContext } from "@/components/Auth/dashboard-context"

function Assignments() {
  const { data } = useDashboardContext()
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Submitted":
        return "outline"
      case "Overdue":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusClassName = (status: string) => {
    if (status === "Submitted") {
      return "border-emerald-500 bg-emerald-50 text-emerald-700"
    }
    return ""
  }

  return (
    <SidebarProvider>
      <SideBar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <TopBar />
          </div>
        </header>
        <main className="p-4">
          <Card className="rounded-3xl border border-border bg-background p-8 shadow-sm">
            <CardHeader>
              <CardTitle className="flex gap-2">
                <Pen size={16} />
                {data.currentSemester ?? "Current semester"} Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>
                  <Alert variant="destructive">
                    <AlertDescription>
                      Assignment deadlines are subject to change. Please verify
                      submission dates and status before the deadline.
                    </AlertDescription>
                  </Alert>
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-auto">Course</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.assignments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No assignments are available in Firebase.
                      </TableCell>
                    </TableRow>
                  )}
                  {data.assignments.map((assignment) => (
                    <TableRow key={`${assignment.course}-${assignment.title}`}>
                      <TableCell className="font-medium">
                        {assignment.course}
                      </TableCell>
                      <TableCell>{assignment.title}</TableCell>
                      <TableCell>{assignment.dueDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusVariant(assignment.status)}
                          className={getStatusClassName(assignment.status)}
                        >
                          {assignment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{assignment.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Assignments
