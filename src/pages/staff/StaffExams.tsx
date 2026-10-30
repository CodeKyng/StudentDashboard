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
import { getAuthErrorMessage } from "@/lib/auth"
import { saveExamForStudents } from "@/lib/staff-data"

export default function StaffExams() {
  const { selectedCourseCode, selectedCourse, roster } = useStaff()
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [hall, setHall] = useState("")
  const [seatNo, setSeatNo] = useState("")
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!selectedCourseCode) {
      toast.error("Select a course first.")
      return
    }
    if (roster.length === 0) {
      toast.error("Roster is empty. Add students first.")
      return
    }
    setSaving(true)
    try {
      await saveExamForStudents(
        {
          course: selectedCourseCode,
          date: date.trim() || "TBA",
          time: time.trim() || "TBA",
          hall: hall.trim() || "TBA",
          seatNo: seatNo.trim() || "—",
        },
        roster.map((r) => r.uid),
        "upsert"
      )
      toast.success(
        `Exam schedule saved for ${roster.length} student${roster.length === 1 ? "" : "s"}.`
      )
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
          <CardTitle>Exam schedule</CardTitle>
          <CardDescription>Select a course first.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Exam schedule</h1>
        <p className="text-sm text-muted-foreground">
          Set the exam sitting for{" "}
          <span className="font-medium text-foreground">
            {selectedCourse?.code} — {selectedCourse?.title}
          </span>
          . Written to each student&apos;s exam list.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam details</CardTitle>
          <CardDescription>
            One entry per course per student (upsert by course code). Seat can
            be left as — if not assigned yet.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid max-w-xl gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="ex-date">Date</Label>
            <Input
              id="ex-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g. 2026-12-10"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ex-time">Time</Label>
            <Input
              id="ex-time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 09:00 AM"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ex-hall">Hall / venue</Label>
            <Input
              id="ex-hall"
              value={hall}
              onChange={(e) => setHall(e.target.value)}
              placeholder="e.g. Naraguta Hall A"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ex-seat">Default seat (optional)</Label>
            <Input
              id="ex-seat"
              value={seatNo}
              onChange={(e) => setSeatNo(e.target.value)}
              placeholder="—"
            />
          </div>
          <Button
            type="button"
            disabled={saving || roster.length === 0}
            onClick={() => void handleSave()}
          >
            {saving
              ? "Saving…"
              : `Save for ${roster.length} student${roster.length === 1 ? "" : "s"}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
