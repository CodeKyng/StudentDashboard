import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

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
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAuthErrorMessage } from "@/lib/auth"
import { scoreToGrade } from "@/lib/grades"
import { saveScoresForCourse } from "@/lib/staff-data"

interface DraftRow {
  uid: string
  displayName: string
  matricNumber?: string
  units: number
  ca: number
  exam: number
}

export default function StaffScores() {
  const {
    selectedCourseCode,
    selectedCourse,
    roster,
    rosterStatus,
    refreshRoster,
  } = useStaff()
  const [draft, setDraft] = useState<DraftRow[]>([])
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    setDraft(
      roster.map((r) => ({
        uid: r.uid,
        displayName: r.displayName,
        matricNumber: r.matricNumber,
        units: r.units,
        ca: r.ca,
        exam: r.exam,
      }))
    )
    setDirty(false)
  }, [roster])

  function update(
    uid: string,
    field: "units" | "ca" | "exam",
    value: number
  ) {
    setDraft((rows) =>
      rows.map((row) => (row.uid === uid ? { ...row, [field]: value } : row))
    )
    setDirty(true)
  }

  const title = selectedCourse?.title || selectedCourseCode

  async function handleSave() {
    if (!selectedCourseCode) return
    setSaving(true)
    try {
      await saveScoresForCourse(
        selectedCourseCode,
        title,
        draft.map((r) => ({
          uid: r.uid,
          units: r.units,
          ca: r.ca,
          exam: r.exam,
        }))
      )
      toast.success("CA and exam scores saved. Grades and CGPA recalculated.")
      setDirty(false)
      await refreshRoster()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  const preview = useMemo(
    () =>
      draft.map((r) => ({
        ...r,
        grade: scoreToGrade((Number(r.ca) || 0) + (Number(r.exam) || 0)),
      })),
    [draft]
  )

  if (!selectedCourseCode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>CA & Exam scores</CardTitle>
          <CardDescription>Select a course first.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CA & Exam scores</h1>
          <p className="text-sm text-muted-foreground">
            Enter continuous assessment and exam scores for{" "}
            <span className="font-medium text-foreground">
              {selectedCourse?.code} — {selectedCourse?.title}
            </span>
            . Grade is calculated automatically (A≥70 … F&lt;40).
          </p>
        </div>
        <Button
          type="button"
          disabled={!dirty || saving || draft.length === 0}
          onClick={() => void handleSave()}
        >
          {saving ? "Saving…" : "Save scores"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Score sheet</CardTitle>
          <CardDescription>
            Writes to each student&apos;s results list and refreshes CGPA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Matric</TableHead>
                  <TableHead className="min-w-[90px]">Units</TableHead>
                  <TableHead className="min-w-[90px]">CA</TableHead>
                  <TableHead className="min-w-[90px]">Exam</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rosterStatus === "loading" && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground"
                    >
                      Loading…
                    </TableCell>
                  </TableRow>
                )}
                {rosterStatus === "ready" && preview.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground"
                    >
                      Roster is empty. Add students from the Staff dashboard.
                    </TableCell>
                  </TableRow>
                )}
                {preview.map((row) => {
                  const total = (Number(row.ca) || 0) + (Number(row.exam) || 0)
                  return (
                    <TableRow key={row.uid}>
                      <TableCell className="font-medium">
                        {row.displayName}
                      </TableCell>
                      <TableCell>{row.matricNumber || "—"}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          value={row.units}
                          onChange={(e) =>
                            update(row.uid, "units", Number(e.target.value))
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={row.ca}
                          onChange={(e) =>
                            update(row.uid, "ca", Number(e.target.value))
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={row.exam}
                          onChange={(e) =>
                            update(row.uid, "exam", Number(e.target.value))
                          }
                        />
                      </TableCell>
                      <TableCell>{total}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{row.grade}</Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Grade from total (CA+Exam): A≥70, B≥60, C≥50, D≥45, E≥40, else F.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
