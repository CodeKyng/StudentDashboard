import { useMemo } from "react"

import { RecordGate } from "@/components/admin/RecordGate"
import { RecordTable } from "@/components/admin/RecordTable"
import { useAdminRecord } from "@/components/admin/admin-context"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { DashboardData, SemesterResult } from "@/lib/dashboard-data"
import {
  computeCgpa,
  formatGpa,
  scoreToGrade,
  withAutoGrades,
} from "@/lib/grades"

function ResultsEditor({ draft }: { draft: DashboardData }) {
  const { patch } = useAdminRecord()

  const graded = useMemo(() => withAutoGrades(draft.results), [draft.results])
  const cgpa = useMemo(() => computeCgpa(draft.results), [draft.results])

  function onResultsChange(rows: SemesterResult[]) {
    const next = withAutoGrades(rows)
    patch({
      results: next,
      cgpa: computeCgpa(next),
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Semester results</CardTitle>
            <CardDescription>
              Enter code, course, units, CA, and exam. Grade and CGPA are
              calculated automatically (do not type the grade).
            </CardDescription>
          </div>
          <Badge variant="secondary" className="w-fit text-base">
            CGPA {formatGpa(cgpa)}
          </Badge>
        </CardHeader>
        <CardContent>
          <RecordTable
            rows={graded}
            emptyLabel="No results recorded."
            createRow={() => ({
              code: "",
              course: "",
              units: 3,
              ca: 0,
              exam: 0,
              grade: "F",
            })}
            onChange={onResultsChange}
            columns={[
              { key: "code", label: "Code", minWidth: "90px" },
              { key: "course", label: "Course", minWidth: "160px" },
              { key: "units", label: "Units", kind: "number", minWidth: "80px" },
              { key: "ca", label: "CA", kind: "number", minWidth: "80px" },
              { key: "exam", label: "Exam", kind: "number", minWidth: "80px" },
              {
                key: "grade",
                label: "Grade (auto)",
                minWidth: "90px",
              },
            ]}
          />
          <p className="mt-3 text-xs text-muted-foreground">
            Grade from total (CA+Exam): A≥70, B≥60, C≥50, D≥45, E≥40, else F.
            Example: CA 28 + Exam 45 = 73 → {scoreToGrade(73)}.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminResults() {
  return (
    <RecordGate>{(draft) => <ResultsEditor draft={draft} />}</RecordGate>
  )
}
