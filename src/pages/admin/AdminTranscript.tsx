import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { FileSearch, Loader2 } from "lucide-react"

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
import { Label } from "@/components/ui/label"
import { getAuthErrorMessage } from "@/lib/auth"
import {
  listTranscriptRequests,
  updateTranscriptRequestStatus,
  type TranscriptRequestRecord,
  type TranscriptStatus,
} from "@/lib/transcript"

const STATUSES: TranscriptStatus[] = [
  "Pending",
  "Processing",
  "Ready",
  "Collected",
  "Rejected",
]

function statusVariant(status: string) {
  if (status === "Ready" || status === "Collected") return "secondary" as const
  if (status === "Rejected") return "destructive" as const
  return "outline" as const
}

export default function AdminTranscript() {
  const [items, setItems] = useState<TranscriptRequestRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | TranscriptStatus>("all")
  const [busyId, setBusyId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setItems(await listTranscriptRequests())
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const visible =
    filter === "all" ? items : items.filter((r) => r.status === filter)

  async function setStatus(req: TranscriptRequestRecord, status: TranscriptStatus) {
    setBusyId(req.id)
    try {
      await updateTranscriptRequestStatus({
        id: req.id,
        status,
        adminNote: notes[req.id],
        existing: req,
      })
      toast.success(`Marked ${status}`)
      await load()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <FileSearch className="size-6" />
          Transcript requests
        </h1>
        <p className="text-sm text-muted-foreground">
          Queue of student transcript requests. Update status as Registry
          processes each one.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All ({items.length})
        </Button>
        {STATUSES.map((s) => (
          <Button
            key={s}
            type="button"
            size="sm"
            variant={filter === s ? "default" : "outline"}
            onClick={() => setFilter(s)}
          >
            {s} ({items.filter((i) => i.status === s).length})
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request queue</CardTitle>
          <CardDescription>
            Students must pass clearance (matric, fees, results) before submitting.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading…
            </p>
          ) : visible.length === 0 ? (
            <p className="text-sm text-muted-foreground">No requests in this filter.</p>
          ) : (
            visible.map((req) => (
              <div
                key={req.id}
                className="space-y-3 rounded-xl border p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={statusVariant(req.status)}>
                        {req.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {req.createdAt.slice(0, 10)} · {req.type} ·{" "}
                        {req.delivery}
                      </span>
                    </div>
                    <p className="font-semibold">{req.studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {req.matricNumber || "No matric"} · {req.studentEmail}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {[req.faculty, req.department, req.level, req.session]
                        .filter(Boolean)
                        .join(" · ") || "Placement not set"}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Purpose:</span>{" "}
                      {req.purpose}
                    </p>
                    {req.notes ? (
                      <p className="text-sm text-muted-foreground">
                        Student note: {req.notes}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`note-${req.id}`}>Admin note</Label>
                  <Input
                    id={`note-${req.id}`}
                    placeholder="Optional note for the student"
                    value={notes[req.id] ?? req.adminNote ?? ""}
                    onChange={(e) =>
                      setNotes((n) => ({ ...n, [req.id]: e.target.value }))
                    }
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <Button
                      key={s}
                      type="button"
                      size="sm"
                      variant={req.status === s ? "default" : "outline"}
                      disabled={busyId === req.id || req.status === s}
                      onClick={() => void setStatus(req, s)}
                    >
                      {busyId === req.id ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : null}
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
