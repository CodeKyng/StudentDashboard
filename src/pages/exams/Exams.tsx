import { SideBar } from "@/components/layout/SideBar"
import TopBar from "@/components/layout/TopBar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

const semester = "2nd Semester 2025/2026"

export interface ExamEntry {
  course: string
  date: string
  time: string
  hall: string
  seatNo: string
}

interface ExamsProps {
  exams: ExamEntry[]
}

function Exams({ exams }: ExamsProps) {
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
                {semester} Exams Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>
                  <Alert variant="destructive">
                    <AlertDescription>
                      Exam schedule is subject to change. Please check back
                      regularly for updates and any changes to the schedule.
                    </AlertDescription>
                  </Alert>
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-auto">Course</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Hall</TableHead>
                    <TableHead>Seat No.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exams.map((exam) => (
                    <TableRow key={`${exam.course}-${exam.date}-${exam.time}`}>
                      <TableCell className="font-medium">
                        {exam.course}
                      </TableCell>
                      <TableCell>{exam.date}</TableCell>
                      <TableCell>{exam.time}</TableCell>
                      <TableCell>{exam.hall}</TableCell>
                      <TableCell>{exam.seatNo}</TableCell>
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

export default Exams
