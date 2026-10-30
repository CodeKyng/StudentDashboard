import { useState } from "react"
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
import { Label } from "@/components/ui/label"
import type { AssignmentStatus } from "@/lib/dashboard-data"
import { getAuthErrorMessage } from "@/lib/auth"
import { saveAssignmentsForStudents } from "@/lib/staff-data"

const statuses: AssignmentStatus[] = ["Pending", "Submitted", "Overdue"]

export default function StaffAssignments() {
  const { selectedCourseCode, selectedCourse, roster } = useStaff()
  const [title, setTitle] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [status, setStatus] = useState<AssignmentStatus>("Pending")
  const [score, setScore] = useState("")
  const [saving, setSaving] = useState(false)

  async function handlePublish() {
    if (!selectedCourseCode) {
      toast.error("Select a course first.")
      return
    }
    if (!title.trim()) {
      toast.error("Assignment title is required.")
      return
    }
    if (roster.length === 0) {
      toast.error("Roster is empty. Add students first.")
      return
    }
    setSaving(true)
    try {
      await saveAssignmentsForStudents(
        selectedCourseCode,
        {
          title: title.trim(),
          dueDate: dueDate.trim() || "TBA",
          status,
          score: score.trim() || "—",
        },
        roster.map((r) => r.uid),
        "upsert"
      )
      toast.success(
        `Assignment published to ${roster.length} student${roster.length === 1 ? "" : "s"}.`
      )
      setTitle("")
      setDueDate("")
      setScore("")
      setStatus("Pending")
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
          <CardTitle>Assignments</CardTitle>
          <CardDescription>Select a course first.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assignments</h1>
        <p className="text-sm text-muted-foreground">
          Publish an assignment to every student on the roster for{" "}
          <span className="font-medium text-foreground">
            {selectedCourse?.code} — {selectedCourse?.title}
          </span>
          .
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New assignment</CardTitle>
          <CardDescription>
            Same title updates existing entry for that course (upsert). Appears
            on each student&apos;s Assignments page.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid max-w-xl gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="asg-title">Title</Label>
            <Input
              id="asg-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lab report 2"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="asg-due">Due date</Label>
            <Input
              id="asg-due"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="e.g. 2026-11-15"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="asg-status">Status</Label>
            <select
              id="asg-status"
              className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as AssignmentStatus)}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="asg-score">Score / mark (optional)</Label>
            <Input
              id="asg-score"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="e.g. 15/20 or —"
            />
          </div>
          <Button
            type="button"
            disabled={saving || roster.length === 0}
            onClick={() => void handlePublish()}
          >
            {saving
              ? "Publishing…"
              : `Publish to ${roster.length} student${roster.length === 1 ? "" : "s"}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
