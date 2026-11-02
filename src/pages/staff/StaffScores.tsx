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
import { computeGpa, scoreToGrade } from "@/lib/grades"
import {
  publishCourseResults,
  saveScoresForCourse,
} from "@/lib/staff-data"

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
  const [publishing, setPublishing] = useState(false)
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

  const preview = useMemo(
    () =>
      draft.map((r) => ({
        ...r,
        grade: scoreToGrade((Number(r.ca) || 0) + (Number(r.exam) || 0)),
      })),
    [draft]
  )

  const classGpa = useMemo(() => {
    return computeGpa(
      preview.map((r) => ({
        code: selectedCourseCode || "",
        course: title || "",
        units: Number(r.units) || 0,
        ca: Number(r.ca) || 0,
        exam: Number(r.exam) || 0,
        grade: r.grade,
      }))
    )
  }, [preview, selectedCourseCode, title])

  async function handleSave() {
    if (!selectedCourseCode) return
    setSaving(true)
    try {
      await saveScoresForCourse(
        selectedCourseCode,
        title || selectedCourseCode,
        draft.map((r) => ({
          uid: r.uid,
          units: r.units,
          ca: r.ca,
          exam: r.exam,
        }))
      )
      toast.success(
        "Scores saved. Grades, semester GPA, and CGPA recalculated for each student."
      )
      setDirty(false)
      await refreshRoster()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  async function handlePublish() {
    if (!selectedCourseCode) return
    if (dirty) {
      toast.error("Save scores first, then publish.")
      return
    }
    if (draft.length === 0) {
      toast.error("No students on this roster.")
      return
    }
    if (
      !window.confirm(
        `Publish results for ${selectedCourseCode}? Students will see official grades, GPA, and CGPA on Results.`
      )
    ) {
      return
    }
    setPublishing(true)
    try {
      // Ensure latest draft is on server before publish
      await saveScoresForCourse(
        selectedCourseCode,
        title || selectedCourseCode,
        draft.map((r) => ({
          uid: r.uid,
          units: r.units,
          ca: r.ca,
          exam: r.exam,
        }))
      )
      const { published } = await publishCourseResults(
        selectedCourseCode,
        title || selectedCourseCode,
        draft.map((r) => r.uid)
      )
      toast.success(
        `Published for ${published} student${published === 1 ? "" : "s"}. GPA/CGPA are live.`
      )
      setDirty(false)
      await refreshRoster()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setPublishing(false)
    }
  }

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
            . Grade, GPA, and CGPA are calculated automatically (A≥70 … F&lt;40).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={!dirty || saving || draft.length === 0}
            onClick={() => void handleSave()}
          >
            {saving ? "Saving…" : "Save scores"}
          </Button>
          <Button
            type="button"
            disabled={publishing || draft.length === 0}
            onClick={() => void handlePublish()}
          >
            {publishing ? "Publishing…" : "Publish results"}
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Students on roster</CardDescription>
            <CardTitle className="text-2xl">{draft.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Class GPA (preview)</CardDescription>
            <CardTitle className="text-2xl">
              {classGpa === undefined ? "—" : classGpa.toFixed(2)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Workflow</CardDescription>
            <CardTitle className="text-base font-medium">
              Save → Publish → Students see GPA/CGPA
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Score sheet</CardTitle>
          <CardDescription>
            Saving writes CA/Exam, auto letter grade, semester GPA, and CGPA on
            each student record. Publish marks results official for the Results
            page.
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
                      No students registered for this course yet.
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
            Grade from total (CA+Exam): A≥70, B≥60, C≥50, D≥45, E≥40, else F ·
            5.0 scale quality points used for GPA/CGPA.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
