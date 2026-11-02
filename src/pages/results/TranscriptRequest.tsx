import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import {
  Check,
  FileSearch,
  Loader2,
  Lock,
  Plus,
} from "lucide-react"

import { SideBar } from "@/components/layout/SideBar"
import TopBar from "@/components/layout/TopBar"
import { useDashboardContext } from "@/components/Auth/dashboard-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getAuthErrorMessage } from "@/lib/auth"
import { formatGpa } from "@/lib/grades"
import {
  getTranscriptClearance,
  listTranscriptRequests,
  submitTranscriptRequest,
  type TranscriptClearanceItem,
  type TranscriptDelivery,
  type TranscriptRequestRecord,
  type TranscriptType,
} from "@/lib/transcript"
import { cn } from "@/lib/utils"

function statusVariant(status: string) {
  if (status === "Ready" || status === "Collected") return "secondary" as const
  if (status === "Rejected") return "destructive" as const
  return "outline" as const
}

function TranscriptRequest() {
  const { data, identity, profile, refresh } = useDashboardContext()
  const [clearance, setClearance] = useState<TranscriptClearanceItem[]>([])
  const [ready, setReady] = useState(false)
  const [requests, setRequests] = useState<TranscriptRequestRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [type, setType] = useState<TranscriptType>("Official")
  const [delivery, setDelivery] = useState<TranscriptDelivery>("Pickup")
  const [purpose, setPurpose] = useState("")
  const [notes, setNotes] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [c, list] = await Promise.all([
        getTranscriptClearance({
          uid: profile.uid,
          matricNumber: identity.matricNumber,
        }),
        listTranscriptRequests({ studentUid: profile.uid }),
      ])
      setClearance(c.items)
      setReady(c.ready)
      setRequests(list)
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [identity.matricNumber, profile.uid])

  useEffect(() => {
    void load()
  }, [load])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!ready) {
      toast.error("Complete clearance first.")
      return
    }
    setSubmitting(true)
    try {
      await submitTranscriptRequest({
        studentUid: profile.uid,
        studentName: profile.displayName,
        studentEmail: profile.email,
        matricNumber: identity.matricNumber,
        faculty: identity.facultyName || data.faculty,
        department: identity.departmentName || data.department,
        level: identity.level || data.level,
        session: identity.session || data.session,
        type,
        delivery,
        purpose,
        notes,
      })
      toast.success("Transcript request submitted.")
      setPurpose("")
      setNotes("")
      await refresh()
      await load()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SidebarProvider>
      <SideBar />
      <SidebarInset>
        <header className="flex h-16 w-full shrink-0 items-center border-b">
          <TopBar title="Transcript" />
        </header>

        <main className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
              <FileSearch className="size-5" />
              Transcript request
            </h1>
            <p className="text-sm text-muted-foreground">
              Request an official academic transcript after clearance. Registry
              will process and update the status here.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Clearance checklist</CardTitle>
                <CardDescription>
                  All required items must pass before you can submit.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {loading ? (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Checking clearance…
                  </p>
                ) : (
                  clearance.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border px-3 py-2",
                        item.ok
                          ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40"
                          : "bg-muted/40"
                      )}
                    >
                      {item.ok ? (
                        <Check className="mt-0.5 size-4 text-emerald-600" />
                      ) : (
                        <Lock className="mt-0.5 size-4 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div className="rounded-lg border bg-muted/30 p-3 text-sm">
                  <p>
                    <span className="text-muted-foreground">CGPA:</span>{" "}
                    <strong>{formatGpa(data.cgpa)}</strong>
                  </p>
                  <p className="text-muted-foreground">
                    {identity.matricNumber || "No matric"} ·{" "}
                    {identity.level || data.level || "Level —"} ·{" "}
                    {identity.session || data.session || "Session —"}
                  </p>
                </div>
                {!ready && !loading && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/school-fees">School fees</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/results">Results</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New request</CardTitle>
                <CardDescription>
                  Official transcripts are processed by the Registry.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <select
                        id="type"
                        className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                        value={type}
                        onChange={(e) =>
                          setType(e.target.value as TranscriptType)
                        }
                        disabled={!ready}
                      >
                        <option value="Official">Official</option>
                        <option value="Student copy">Student copy</option>
                        <option value="Electronic">Electronic</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="delivery">Delivery</Label>
                      <select
                        id="delivery"
                        className="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
                        value={delivery}
                        onChange={(e) =>
                          setDelivery(e.target.value as TranscriptDelivery)
                        }
                        disabled={!ready}
                      >
                        <option value="Pickup">Pickup</option>
                        <option value="Email">Email</option>
                        <option value="Courier">Courier</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose</Label>
                    <Input
                      id="purpose"
                      placeholder="e.g. Job application, further studies"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      disabled={!ready}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      disabled={!ready}
                      placeholder="Extra instructions for Registry…"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!ready || submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        <Plus className="size-4" />
                        Submit transcript request
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Enquiries:{" "}
                <a
                  className="text-primary underline"
                  href="mailto:registry@unijos.edu.ng"
                >
                  registry@unijos.edu.ng
                </a>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your requests</CardTitle>
              <CardDescription>
                Status updates from Admin / Registry appear here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : requests.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No transcript requests yet.
                </p>
              ) : (
                requests.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-col gap-2 rounded-xl border p-4 sm:flex-row sm:items-start sm:justify-between"
                  >
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
                      <p className="font-medium">{req.purpose}</p>
                      {req.adminNote ? (
                        <p className="text-sm text-muted-foreground">
                          Note: {req.adminNote}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default TranscriptRequest
