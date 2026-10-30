import { useEffect, useState } from "react"
import { toast } from "sonner"

import { useStaff } from "@/components/staff/staff-context"
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
import { saveAttendanceForCourse } from "@/lib/staff-data"

interface DraftRow {
  uid: string
  displayName: string
  matricNumber?: string
  percentage: number
  progress: number
}

export default function StaffAttendance() {
  const { selectedCourseCode, selectedCourse, roster, rosterStatus, refreshRoster } =
    useStaff()
  const [draft, setDraft] = useState<DraftRow[]>([])
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    setDraft(
      roster.map((r) => ({
        uid: r.uid,
        displayName: r.displayName,
        matricNumber: r.matricNumber,
        percentage: r.attendancePercentage,
        progress: r.attendanceProgress,
      }))
    )
    setDirty(false)
  }, [roster])

  function update(uid: string, field: "percentage" | "progress", value: number) {
    setDraft((rows) =>
      rows.map((row) =>
        row.uid === uid ? { ...row, [field]: value } : row
      )
    )
    setDirty(true)
  }

  async function handleSave() {
    if (!selectedCourseCode) return
    setSaving(true)
    try {
      await saveAttendanceForCourse(
        selectedCourseCode,
        draft.map((r) => ({
          uid: r.uid,
          percentage: r.percentage,
          progress: r.progress,
        }))
      )
      toast.success("Attendance saved for all students on the roster.")
      setDirty(false)
      await refreshRoster()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  if (!selectedCourseCode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance</CardTitle>
          <CardDescription>Select a course first.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
          <p className="text-sm text-muted-foreground">
            Enter attendance percentage (and optional session progress) for{" "}
            <span className="font-medium text-foreground">
              {selectedCourse?.code} — {selectedCourse?.title}
            </span>
            .
          </p>
        </div>
        <Button
          type="button"
          disabled={!dirty || saving || draft.length === 0}
          onClick={() => void handleSave()}
        >
          {saving ? "Saving…" : "Save attendance"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class roster</CardTitle>
          <CardDescription>
            Values write to each student&apos;s{" "}
            <code className="text-xs">attendanceCourses</code> and update overall
            attendance %.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Matric</TableHead>
                  <TableHead className="min-w-[120px]">Progress</TableHead>
                  <TableHead className="min-w-[140px]">Attendance %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rosterStatus === "loading" && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      Loading…
                    </TableCell>
                  </TableRow>
                )}
                {rosterStatus === "ready" && draft.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      Roster is empty. Add students from the Staff dashboard.
                    </TableCell>
                  </TableRow>
                )}
                {draft.map((row) => (
                  <TableRow key={row.uid}>
                    <TableCell className="font-medium">
                      {row.displayName}
                    </TableCell>
                    <TableCell>{row.matricNumber || "—"}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        value={row.progress}
                        onChange={(e) =>
                          update(row.uid, "progress", Number(e.target.value))
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={row.percentage}
                        onChange={(e) =>
                          update(row.uid, "percentage", Number(e.target.value))
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
