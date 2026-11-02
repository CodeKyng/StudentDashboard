import { Badge } from "@/components/ui/badge"
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
import {
  classOfDegree,
  computeCgpa,
  computeGpa,
  formatGpa,
  qualityPoints,
  totalScore,
  withAutoGrades,
} from "@/lib/grades"

const getGradeBadgeClass = (grade: string) => {
  if (grade === "A" || grade === "B") {
    return "border-emerald-500 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300"
  }
  if (grade === "C") {
    return "border-amber-500 text-amber-700 bg-amber-50 dark:bg-amber-950/40"
  }
  return ""
}

const getGradeBadgeVariant = (grade: string) => {
  if (grade === "A" || grade === "B" || grade === "C") {
    return "outline" as const
  }
  return "destructive" as const
}

function SemesterResults() {
  const { data } = useDashboardContext()
  const results = withAutoGrades(data.results)
  const semesterGpa = data.semesterGpa ?? computeGpa(results)
  const cgpa = data.cgpa ?? computeCgpa(results)
  const { totalUnits, totalQualityPoints } = qualityPoints(results)
  const position = classOfDegree(cgpa)
  const published = data.resultsPublished === true

  return (
    <SidebarProvider>
      <SideBar />
      <SidebarInset>
        <header className="flex h-16 w-full shrink-0 items-center border-b">
          <TopBar title="Results and GPA" />
        </header>

        <div className="space-y-4 p-4 md:p-6">
          {!published && results.length > 0 && (
            <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20">
              <CardHeader className="py-3">
                <CardTitle className="text-base">Awaiting publication</CardTitle>
                <CardDescription>
                  Staff have entered scores. Official publication is pending —
                  figures below update live from your CA and exam records.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {published && (
            <Card className="border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20">
              <CardHeader className="py-3">
                <CardTitle className="text-base text-emerald-800 dark:text-emerald-200">
                  Results published
                </CardTitle>
                <CardDescription>
                  Grades, semester GPA, and CGPA are official for this cycle.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Semester results</CardTitle>
                <CardDescription>
                  {data.currentSemester ?? data.session ?? "Current semester"} ·
                  Grades from CA + Exam (5.0 scale)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>
                    Automatic grade: A≥70, B≥60, C≥50, D≥45, E≥40, else F.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Units</TableHead>
                      <TableHead>CA</TableHead>
                      <TableHead>Exam</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No results yet. Register courses and wait for staff to
                          enter CA and exam scores.
                        </TableCell>
                      </TableRow>
                    )}
                    {results.map((result) => (
                      <TableRow key={result.code}>
                        <TableCell className="font-mono font-medium">
                          {result.code}
                        </TableCell>
                        <TableCell>{result.course}</TableCell>
                        <TableCell>{result.units}</TableCell>
                        <TableCell>{result.ca}</TableCell>
                        <TableCell>{result.exam}</TableCell>
                        <TableCell>{totalScore(result)}</TableCell>
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
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="rounded-3xl">
                <CardHeader>
                  <CardDescription>Semester GPA</CardDescription>
                  <CardTitle className="text-4xl tabular-nums">
                    {formatGpa(semesterGpa)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Weighted by course units for the courses on this record.
                </CardContent>
              </Card>

              <Card className="rounded-3xl">
                <CardHeader>
                  <CardDescription>Cumulative GPA (CGPA)</CardDescription>
                  <CardTitle className="text-4xl tabular-nums">
                    {formatGpa(cgpa)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="font-medium">{position}</p>
                  <p className="text-sm text-muted-foreground">
                    {totalUnits} units · {totalQualityPoints.toFixed(1)} quality
                    points · 5.0 scale
                  </p>
                  {data.previousCgpa !== undefined && (
                    <p className="text-xs text-muted-foreground">
                      Previous CGPA: {formatGpa(data.previousCgpa)}
                    </p>
                  )}
                </CardContent>
              </Card>

              {data.gpaHistory && (
                <Card className="rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-base">GPA history</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm text-muted-foreground">
                    <p>
                      100Lvl 1st:{" "}
                      {data.gpaHistory.firstLevelFirstSemester.toFixed(2)}
                    </p>
                    <p>
                      100Lvl 2nd:{" "}
                      {data.gpaHistory.firstLevelSecondSemester.toFixed(2)}
                    </p>
                    <p>
                      200Lvl 1st:{" "}
                      {data.gpaHistory.secondLevelFirstSemester.toFixed(2)}
                    </p>
                    <p>
                      200Lvl 2nd:{" "}
                      {data.gpaHistory.secondLevelSecondSemester.toFixed(2)}
                    </p>
                    <p>
                      300Lvl 1st:{" "}
                      {data.gpaHistory.thirdLevelFirstSemester.toFixed(2)}
                    </p>
                    <p>
                      300Lvl 2nd:{" "}
                      {data.gpaHistory.thirdLevelSecondSemester.toFixed(2)}
                    </p>
                    <p>
                      400Lvl 1st:{" "}
                      {data.gpaHistory.fourthLevelFirstSemester.toFixed(2)}
                    </p>
                    <p>
                      400Lvl 2nd:{" "}
                      {data.gpaHistory.fourthLevelSecondSemester.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default SemesterResults
