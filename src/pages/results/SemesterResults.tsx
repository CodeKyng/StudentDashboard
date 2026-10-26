import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SideBar } from "@/components/layout/SideBar"
import TopBar from "@/components/layout/TopBar"
import { useDashboardContext } from "@/components/Auth/dashboard-context"

const getGradeBadgeClass = (grade: string) => {
  if (grade === "A" || grade === "B") {
    return "border-emerald-500 text-emerald-700 bg-emerald-50"
  }

  if (grade === "C") {
    return ""
  }

  return ""
}

const getGradeBadgeVariant = (grade: string) => {
  if (grade === "A" || grade === "B" || grade === "C") {
    return "outline"
  }

  return "destructive"
}

const gradePoints: { [key: string]: number } = {
  A: 5.0,
  B: 4.0,
  C: 3.0,
  D: 2.0,
  F: 0.0,
}

function SemesterResults() {
  const { data } = useDashboardContext()
  const { results, gpaHistory } = data
  const totalUnits = results.reduce((sum, result) => sum + result.units, 0)
  const totalGradePoints = results.reduce(
    (sum, result) => sum + (gradePoints[result.grade] || 0) * result.units,
    0
  )
  const cgpa = totalUnits > 0 ? totalGradePoints / totalUnits : undefined

  const getPosition = (cgpa: number) => {
    if (cgpa > 4.49) {
      return "First Class"
    }
    if (cgpa >= 3.5 && cgpa <= 4.49) {
      return "Second Class Upper"
    }
    if (cgpa >= 2.5 && cgpa < 3.5) {
      return "Second Class Lower"
    }
    return "Third Class"
  }

  const position = cgpa === undefined ? "Not available" : getPosition(cgpa)

  return (
    <SidebarProvider>
      <SideBar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center border-b">
          <TopBar />
        </header>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Table className="w-full">
            <TableCaption>
              {data.currentSemester ?? "Current semester"} results and final
              grades.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-auto">Code</TableHead>
                <TableHead className="w-auto">Course</TableHead>
                <TableHead className="w-auto">Units</TableHead>
                <TableHead className="w-auto">CA</TableHead>
                <TableHead className="w-auto">Exams</TableHead>
                <TableHead className="w-auto">Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No results are available in Firebase.
                  </TableCell>
                </TableRow>
              )}
              {results.map((result) => (
                <TableRow key={result.code}>
                  <TableCell className="font-medium">{result.code}</TableCell>
                  <TableCell>{result.course}</TableCell>
                  <TableCell>{result.units}</TableCell>
                  <TableCell>{result.ca}</TableCell>
                  <TableCell>{result.exam}</TableCell>
                  <TableCell>
                    <Badge
                      variant={getGradeBadgeVariant(result.grade)}
                      className={getGradeBadgeClass(result.grade)}
                    >
                      {result.grade}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="w-full">
            <Card className="rounded-3xl border border-border bg-background p-8 shadow-sm">
              <h2 className="text-lg font-semibold">Cumulative GPA</h2>
              <h1 className="text-4xl font-bold">
                {cgpa === undefined ? "—" : cgpa.toFixed(2)}
              </h1>
              <p>{position}</p>
              <p className="text-sm text-muted-foreground">5.0 Scale.</p>
            </Card>
            <Card className="mt-4 rounded-3xl border border-border bg-background p-8 shadow-sm">
              <h2 className="text-lg font-semibold">GPA History</h2>
              {gpaHistory && (
                <>
                  <p className="text-sm text-muted-foreground">
                    100Lvl First Semester:{" "}
                    {gpaHistory.firstLevelFirstSemester.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    100Lvl Second Semester:{" "}
                    {gpaHistory.firstLevelSecondSemester.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    200Lvl First Semester:{" "}
                    {gpaHistory.secondLevelFirstSemester.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    200Lvl Second Semester:{" "}
                    {gpaHistory.secondLevelSecondSemester.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    300Lvl First Semester:{" "}
                    {gpaHistory.thirdLevelFirstSemester.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    300Lvl Second Semester:{" "}
                    {gpaHistory.thirdLevelSecondSemester.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    400Lvl First Semester:{" "}
                    {gpaHistory.fourthLevelFirstSemester.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    400Lvl Second Semester:{" "}
                    {gpaHistory.fourthLevelSecondSemester.toFixed(2)}
                  </p>
                </>
              )}
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default SemesterResults
