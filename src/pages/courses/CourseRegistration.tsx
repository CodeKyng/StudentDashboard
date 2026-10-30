import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import {
  BookOpen,
  Check,
  GraduationCap,
  IdCard,
  Layers,
  Loader2,
  Lock,
  Search,
  X,
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getAuthErrorMessage } from "@/lib/auth"
import type { Course, DashboardCourse } from "@/lib/dashboard-data"
import { saveRegisteredCourses } from "@/lib/student-data"
import { cn } from "@/lib/utils"

const MAX_UNITS = 18

function CourseRegistration() {
  const { data, identity, profile, setData, refresh } = useDashboardContext()
  const [selected, setSelected] = useState<Set<string>>(() => {
    return new Set(data.courses.map((c) => c.code))
  })
  const [query, setQuery] = useState("")
  const [saving, setSaving] = useState(false)

  const hasMatric = Boolean(identity.matricNumber?.trim())
  const hasFaculty = Boolean(
    identity.facultyName?.trim() ||
      identity.facultyId?.trim() ||
      data.faculty?.trim()
  )
  const hasDepartment = Boolean(
    identity.departmentName?.trim() ||
      identity.departmentId?.trim() ||
      data.department?.trim()
  )
  const placementReady = hasMatric && hasFaculty && hasDepartment
  const eligible = data.registrationEligible === true
  const canRegister = placementReady && eligible

  const facultyLabel = identity.facultyName || data.faculty || "—"
  const departmentLabel = identity.departmentName || data.department || "—"
  const levelLabel = identity.level || data.level || "—"
  const sessionLabel = identity.session || data.session || "—"

  const catalog = useMemo(() => {
    const all = data.courseCatalog ?? []
    const deptName = (
      identity.departmentName ||
      data.department ||
      ""
    ).toLowerCase()
    const deptId = (identity.departmentId || "").toLowerCase()
    const scoped = all.filter((c) => {
      const byName =
        deptName &&
        (c.departmentName?.toLowerCase() === deptName ||
          c.department?.toLowerCase() === deptName)
      const byId =
        deptId &&
        (c.department?.toLowerCase() === deptId ||
          c.departmentName?.toLowerCase().includes(deptId))
      return byName || byId
    })
    return scoped.length > 0 ? scoped : all
  }, [
    data.courseCatalog,
    data.department,
    identity.departmentId,
    identity.departmentName,
  ])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return catalog
    return catalog.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    )
  }, [catalog, query])

  const selectedUnits = useMemo(() => {
    return Array.from(selected).reduce((sum, code) => {
      const course = catalog.find((c) => c.code === code)
      return sum + (course?.units || 0)
    }, 0)
  }, [selected, catalog])

  function toggle(code: string) {
    if (!canRegister) return
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  }

  async function handleSubmit() {
    if (!canRegister) {
      toast.error("Complete placement and eligibility before registering.")
      return
    }
    if (selected.size === 0) {
      toast.error("Select at least one course.")
      return
    }
    if (selectedUnits > MAX_UNITS) {
      toast.error(`You cannot exceed ${MAX_UNITS} units.`)
      return
    }
    const enrolled: DashboardCourse[] = Array.from(selected)
      .map((code) => catalog.find((c) => c.code === code))
      .filter((c): c is Course => Boolean(c))
      .map((c) => ({
        code: c.code,
        title: c.name,
        description: c.description,
        progress: 0,
      }))
    setSaving(true)
    try {
      await saveRegisteredCourses(profile.uid, enrolled)
      setData((prev) => ({ ...prev, courses: enrolled }))
      toast.success("Course registration saved.")
      await refresh()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <SidebarProvider>
      <SideBar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center border-b">
          <div className="px-3">
            <TopBar title="Course registration" />
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-cyan-600 to-cyan-800 text-white shadow-md">
            <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-cyan-100">
                  Student placement
                </p>
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {profile.displayName}
                </h1>
                <p className="text-sm text-cyan-50/90">
                  {hasMatric ? (
                    <span className="font-mono font-semibold">
                      {identity.matricNumber}
                    </span>
                  ) : (
                    <span className="text-amber-200">Matric not assigned</span>
                  )}
                  {" · "}
                  {levelLabel} · {sessionLabel}
                </p>
                <p className="text-sm text-cyan-100">
                  {facultyLabel}
                  {departmentLabel !== "—" ? ` · ${departmentLabel}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className={
                    hasMatric
                      ? "bg-white/15 text-white hover:bg-white/20"
                      : "bg-amber-500/30 text-white hover:bg-amber-500/40"
                  }
                >
                  <IdCard className="size-3.5" />
                  {hasMatric ? "Matric set" : "Need matric"}
                </Badge>
                <Badge
                  variant="secondary"
                  className={
                    hasFaculty && hasDepartment
                      ? "bg-white/15 text-white hover:bg-white/20"
                      : "bg-amber-500/30 text-white hover:bg-amber-500/40"
                  }
                >
                  <GraduationCap className="size-3.5" />
                  {hasFaculty && hasDepartment
                    ? "Faculty & dept"
                    : "Need faculty/dept"}
                </Badge>
                <Badge
                  variant="secondary"
                  className={
                    eligible
                      ? "bg-white/15 text-white hover:bg-white/20"
                      : "bg-amber-500/30 text-white hover:bg-amber-500/40"
                  }
                >
                  <BookOpen className="size-3.5" />
                  {eligible ? "Eligible" : "Not eligible"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {!placementReady ? (
            <Card className="border-dashed">
              <CardHeader className="text-center sm:text-left">
                <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted sm:mx-0">
                  <Lock className="size-5 text-muted-foreground" />
                </div>
                <CardTitle>Course catalog is locked</CardTitle>
                <CardDescription className="text-base">
                  You can only view and register courses after an administrator
                  assigns your matriculation number and faculty / department.
                  This keeps registration tied to the correct programme.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="grid gap-2 text-sm sm:grid-cols-3">
                  <GateItem ok={hasMatric} label="Matriculation number" />
                  <GateItem ok={hasFaculty} label="Faculty" />
                  <GateItem ok={hasDepartment} label="Department" />
                </ul>
                <p className="text-sm text-muted-foreground">
                  Contact your faculty office or wait until admin updates your
                  record under Students.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/dashboard">Back to dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          ) : !eligible ? (
            <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
                  <Lock className="size-4" />
                  Placement complete — registration not opened
                </CardTitle>
                <CardDescription>
                  Your matric and department are set, but an administrator has
                  not marked you registration eligible for this session yet. The
                  catalog stays hidden until then.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                      Available courses
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Showing catalog for {departmentLabel}
                      {catalog.length === 0 ? " — no courses loaded yet" : ""}
                    </p>
                  </div>
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="Search code or title…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </div>

                {filtered.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="py-10 text-center text-sm text-muted-foreground">
                      No courses match. Admin may still need to publish the
                      course catalog for your department.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {filtered.map((course) => {
                      const isOn = selected.has(course.code)
                      return (
                        <button
                          key={course.code}
                          type="button"
                          onClick={() => toggle(course.code)}
                          className={cn(
                            "rounded-xl border p-4 text-left transition-all hover:border-cyan-500/50 hover:shadow-sm",
                            isOn
                              ? "border-cyan-600 bg-cyan-50/80 ring-1 ring-cyan-600/30 dark:bg-cyan-950/40"
                              : "bg-card"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-mono text-sm font-semibold text-cyan-800 dark:text-cyan-300">
                              {course.code}
                            </span>
                            <span
                              className={cn(
                                "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs",
                                isOn
                                  ? "border-cyan-600 bg-cyan-600 text-white"
                                  : "border-muted-foreground/30"
                              )}
                            >
                              {isOn ? <Check className="size-3.5" /> : null}
                            </span>
                          </div>
                          <p className="mt-1 font-medium leading-snug">
                            {course.name}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {course.description || "No description"}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            <Badge variant="outline" className="text-xs">
                              {course.units} units
                            </Badge>
                            {course.semester ? (
                              <Badge variant="secondary" className="text-xs">
                                {course.semester}
                              </Badge>
                            ) : null}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              <aside className="lg:sticky lg:top-4 lg:self-start">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Layers className="size-4" />
                      Your selection
                    </CardTitle>
                    <CardDescription>
                      Max {MAX_UNITS} units this semester
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-bold tabular-nums">
                          {selectedUnits}
                          <span className="text-lg font-normal text-muted-foreground">
                            /{MAX_UNITS}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selected.size} course
                          {selected.size === 1 ? "" : "s"}
                        </p>
                      </div>
                      {selectedUnits > MAX_UNITS && (
                        <Badge variant="destructive">Over limit</Badge>
                      )}
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          selectedUnits > MAX_UNITS
                            ? "bg-destructive"
                            : "bg-cyan-600"
                        )}
                        style={{
                          width: `${Math.min(
                            100,
                            (selectedUnits / MAX_UNITS) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    <ul className="max-h-48 space-y-1 overflow-y-auto text-sm">
                      {selected.size === 0 && (
                        <li className="text-muted-foreground">
                          No courses selected
                        </li>
                      )}
                      {Array.from(selected).map((code) => {
                        const c = catalog.find((x) => x.code === code)
                        return (
                          <li
                            key={code}
                            className="flex items-center justify-between gap-2 rounded-md bg-muted/50 px-2 py-1.5"
                          >
                            <span className="truncate font-mono text-xs">
                              {code}
                            </span>
                            <button
                              type="button"
                              className="text-muted-foreground hover:text-foreground"
                              onClick={() => toggle(code)}
                              aria-label={`Remove ${code}`}
                            >
                              <X className="size-3.5" />
                            </button>
                            <span className="text-xs text-muted-foreground">
                              {c?.units ?? "—"}u
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                    <Button
                      className="w-full"
                      size="lg"
                      disabled={
                        saving ||
                        selected.size === 0 ||
                        selectedUnits > MAX_UNITS
                      }
                      onClick={() => void handleSubmit()}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Saving…
                        </>
                      ) : (
                        <>
                          <Check className="size-4" />
                          Submit registration
                        </>
                      )}
                    </Button>
                    {data.courses.length > 0 && (
                      <p className="text-center text-xs text-muted-foreground">
                        Currently enrolled: {data.courses.length} course
                        {data.courses.length === 1 ? "" : "s"} on record
                      </p>
                    )}
                  </CardContent>
                </Card>
              </aside>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

function GateItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2",
        ok
          ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-100"
          : "border-border bg-muted/40 text-muted-foreground"
      )}
    >
      {ok ? (
        <Check className="size-4 shrink-0 text-emerald-600" />
      ) : (
        <Lock className="size-4 shrink-0" />
      )}
      {label}
    </li>
  )
}

export default CourseRegistration
