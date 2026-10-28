import { RecordGate } from "@/components/admin/RecordGate"
import { NumberField } from "@/components/admin/Fields"
import { RecordTable } from "@/components/admin/RecordTable"
import { useAdminRecord } from "@/components/admin/admin-context"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminResults() {
  const { patch } = useAdminRecord()

  return (
    <RecordGate>
      {(draft) => (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Semester results</CardTitle>
              <CardDescription>Course scores and grades for the student.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecordTable
                rows={draft.results}
                emptyLabel="No results recorded."
                createRow={() => ({
                  code: "",
                  course: "",
                  units: 0,
                  ca: 0,
                  exam: 0,
                  grade: "",
                })}
                onChange={(results) => patch({ results })}
                columns={[
                  { key: "code", label: "Code", minWidth: "90px" },
                  { key: "course", label: "Course", minWidth: "160px" },
                  { key: "units", label: "Units", kind: "number", minWidth: "80px" },
                  { key: "ca", label: "CA", kind: "number", minWidth: "80px" },
                  { key: "exam", label: "Exam", kind: "number", minWidth: "80px" },
                  { key: "grade", label: "Grade", minWidth: "80px" },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>GPA history</CardTitle>
              <CardDescription>Semester-by-semester GPA values.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(
                [
                  ["firstLevelFirstSemester", "100L First"],
                  ["firstLevelSecondSemester", "100L Second"],
                  ["secondLevelFirstSemester", "200L First"],
                  ["secondLevelSecondSemester", "200L Second"],
                  ["thirdLevelFirstSemester", "300L First"],
                  ["thirdLevelSecondSemester", "300L Second"],
                  ["fourthLevelFirstSemester", "400L First"],
                  ["fourthLevelSecondSemester", "400L Second"],
                ] as const
              ).map(([key, label]) => (
                <NumberField
                  key={key}
                  label={label}
                  value={draft.gpaHistory?.[key]}
                  onChange={(value) =>
                    patch({
                      gpaHistory: {
                        firstLevelFirstSemester:
                          draft.gpaHistory?.firstLevelFirstSemester ?? 0,
                        firstLevelSecondSemester:
                          draft.gpaHistory?.firstLevelSecondSemester ?? 0,
                        secondLevelFirstSemester:
                          draft.gpaHistory?.secondLevelFirstSemester ?? 0,
                        secondLevelSecondSemester:
                          draft.gpaHistory?.secondLevelSecondSemester ?? 0,
                        thirdLevelFirstSemester:
                          draft.gpaHistory?.thirdLevelFirstSemester ?? 0,
                        thirdLevelSecondSemester:
                          draft.gpaHistory?.thirdLevelSecondSemester ?? 0,
                        fourthLevelFirstSemester:
                          draft.gpaHistory?.fourthLevelFirstSemester ?? 0,
                        fourthLevelSecondSemester:
                          draft.gpaHistory?.fourthLevelSecondSemester ?? 0,
                        [key]: value ?? 0,
                      },
                    })
                  }
                />
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </RecordGate>
  )
}
