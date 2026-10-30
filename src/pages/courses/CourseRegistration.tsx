import { useCallback, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import {
  AlertTriangle,
  Check,
  CreditCard,
  GraduationCap,
  IdCard,
  Layers,
  Loader2,
  Lock,
  Search,
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
import type { DashboardCourse } from "@/lib/dashboard-data"
import {
  listInstitutionCourses,
  type InstitutionCourse,
} from "@/lib/institution-data"
import {
  isSchoolFeesPaid,
  saveRegisteredCourses,
} from "@/lib/student-data"
import {
  getMaxUnitsForPlacement,
  isFailedGrade,
} from "@/lib/unit-limits"
import { cn } from "@/lib/utils"

type OfferKind = "current" | "failed"

interface CourseOffer extends InstitutionCourse {
  kind: OfferKind
  priorGrade?: string
}

function GateItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2",
        ok
          ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40"
          : "bg-muted/40"
      )}
    >
      {ok ? (
        <Check className="size-4 text-emerald-600" />
      ) : (
        <Lock className="size-4 text-muted-foreground" />
      )}
      <span className="text-sm">{label}</span>
    </li>
  )
}

function courseKey(code: string) {
  return code.trim().toUpperCase()
}

function CourseRegistration() {
  const { data, identity, profile, setData, refresh } = useDashboardContext()
  const [offers, setOffers] = useState<CourseOffer[]>([])
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [maxUnits, setMaxUnits] = useState(18)
  const [limitMatched, setLimitMatched] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(() => {
    return new Set(data.courses.map((c) => courseKey(c.code)))
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
  const hasLevel = Boolean(identity.level?.trim() || data.level?.trim())
  const placementReady = hasMatric && hasFaculty && hasDepartment && hasLevel
  const feesPaid = isSchoolFeesPaid(data)
  // Eligible for registration once placement is set and school fees are paid
  const canRegister = placementReady && feesPaid

  const facultyLabel = identity.facultyName || data.faculty || "—"
  const departmentLabel = identity.departmentName || data.department || "—"
  const levelLabel = identity.level || data.level || "—"
  const sessionLabel = identity.session || data.session || "—"

  const loadOffers = useCallback(async () => {
    setCatalogLoading(true)
    try {
      const [all, limitInfo] = await Promise.all([
        listInstitutionCourses(),
        getMaxUnitsForPlacement({
          facultyId: identity.facultyId,
          departmentId: identity.departmentId,
          level: identity.level || data.level,
        }),
      ])
      setMaxUnits(limitInfo.maxUnits)
      setLimitMatched(limitInfo.matched)

      const deptId = (identity.departmentId || "").toLowerCase()
      const deptName = (
        identity.departmentName ||
        data.department ||
        ""
      ).toLowerCase()
      const level = (identity.level || data.level || "").toLowerCase()

      const byDept = all.filter((c) => {
        const byId = deptId && c.departmentId?.toLowerCase() === deptId
        const byName =
          deptName && c.departmentName?.toLowerCase() === deptName
        return byId || byName
      })

      const currentLevel = byDept.filter(
        (c) => !c.level || c.level.toLowerCase() === level
      )

      const failedCodes = new Set(
        data.results
          .filter((r) => isFailedGrade(r.grade))
          .map((r) => courseKey(r.code))
      )

      const failedOffers: CourseOffer[] = []
      for (const code of failedCodes) {
        const inst =
          all.find((c) => courseKey(c.code) === code) ||
          byDept.find((c) => courseKey(c.code) === code)
        const result = data.results.find((r) => courseKey(r.code) === code)
        if (inst) {
          failedOffers.push({
            ...inst,
            kind: "failed",
            priorGrade: result?.grade,
          })
        } else if (result) {
          failedOffers.push({
            id: code,
            code: result.code,
            title: result.course,
            description: "Failed course — re-register",
            units: result.units || 3,
            level: levelLabel,
            semester: "",
            departmentId: identity.departmentId || "",
            departmentName: departmentLabel,
            facultyId: identity.facultyId || "",
            facultyName: facultyLabel,
            prerequisites: [],
            kind: "failed",
            priorGrade: result.grade,
          })
        }
      }

      const currentCodes = new Set(currentLevel.map((c) => courseKey(c.code)))
      const offersList: CourseOffer[] = [
        ...currentLevel.map((c) => ({
          ...c,
          kind: "current" as const,
          priorGrade: failedCodes.has(courseKey(c.code))
            ? data.results.find((r) => courseKey(r.code) === courseKey(c.code))
                ?.grade
            : undefined,
        })),
        ...failedOffers.filter((f) => !currentCodes.has(courseKey(f.code))),
      ]

      const merged = offersList.map((o) => {
        if (failedCodes.has(courseKey(o.code)) && o.kind === "current") {
          return {
            ...o,
            kind: "failed" as const,
            priorGrade:
              o.priorGrade ||
              data.results.find((r) => courseKey(r.code) === courseKey(o.code))
                ?.grade,
          }
        }
        return o
      })

      setOffers(
        merged.sort((a, b) => {
          if (a.kind !== b.kind) return a.kind === "failed" ? -1 : 1
          return a.code.localeCompare(b.code)
        })
      )
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
      setOffers([])
    } finally {
      setCatalogLoading(false)
    }
  }, [
    data.department,
    data.level,
    data.results,
    departmentLabel,
    facultyLabel,
    identity.departmentId,
    identity.departmentName,
    identity.facultyId,
    identity.level,
    levelLabel,
  ])

  useEffect(() => {
    if (canRegister) void loadOffers()
    else setCatalogLoading(false)
  }, [canRegister, loadOffers])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return offers
    return offers.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    )
  }, [offers, query])

  const selectedUnits = useMemo(() => {
    return Array.from(selected).reduce((sum, code) => {
      const course = offers.find((c) => courseKey(c.code) === code)
      return sum + (course?.units || 0)
    }, 0)
  }, [selected, offers])

  function toggle(code: string) {
    if (!canRegister) return
    const key = courseKey(code)
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
        return next
      }
      const course = offers.find((c) => courseKey(c.code) === key)
      const nextUnits = selectedUnits + (course?.units || 0)
      if (nextUnits > maxUnits) {
        toast.error(
          `Unit limit is ${maxUnits}. Adding ${code} would exceed the cap set by admin.`
        )
        return prev
      }
      next.add(key)
      return next
    })
  }

  async function handleSubmit() {
    if (!feesPaid) {
      toast.error("Pay school fees before registering courses.")
      return
    }
    if (!placementReady) {
      toast.error("Complete placement before registering.")
      return
    }
    if (selected.size === 0) {
      toast.error("Select at least one course.")
      return
    }
    if (selectedUnits > maxUnits) {
      toast.error(`You cannot exceed ${maxUnits} units.`)
      return
    }

    const enrolled: DashboardCourse[] = Array.from(selected)
      .map((code) => offers.find((c) => courseKey(c.code) === code))
      .filter((c): c is CourseOffer => Boolean(c))
      .map((c) => ({
        code: c.code,
        title: c.title,
        description: c.description,
        progress: 0,
      }))

    setSaving(true)
    try {
      await saveRegisteredCourses(profile.uid, enrolled, {
        displayName: profile.displayName,
        email: profile.email,
        matricNumber: identity.matricNumber,
        institutionCourses: offers,
      })
      setData((prev) => ({ ...prev, courses: enrolled }))
      toast.success("Registration submitted.")
      await refresh()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  const currentCount = filtered.filter((o) => o.kind === "current").length
  const failedCount = filtered.filter((o) => o.kind === "failed").length

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
                  Course registration form
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
                  {" · Level "}{levelLabel} · {sessionLabel}
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
                    feesPaid
                      ? "bg-white/15 text-white hover:bg-white/20"
                      : "bg-amber-500/30 text-white"
                  }
                >
                  <CreditCard className="size-3.5" />
                  {feesPaid ? "Fees paid" : "Fees unpaid"}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-white/15 text-white hover:bg-white/20"
                >
                  <Layers className="size-3.5" />
                  Max {maxUnits} units
                  {!limitMatched ? " (default)" : ""}
                </Badge>
                <Badge
                  variant="secondary"
                  className={
                    canRegister
                      ? "bg-white/15 text-white hover:bg-white/20"
                      : "bg-amber-500/30 text-white"
                  }
                >
                  {canRegister ? "Eligible to register" : "Not ready"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {!placementReady ? (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>Registration locked</CardTitle>
                <CardDescription>
                  Admin must set matric, faculty, department, and level before
                  the form opens.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <GateItem ok={hasMatric} label="Matriculation number" />
                  <GateItem ok={hasFaculty} label="Faculty" />
                  <GateItem ok={hasDepartment} label="Department" />
                  <GateItem ok={hasLevel} label="Level" />
                </ul>
                <Button variant="outline" asChild>
                  <Link to="/dashboard">Back to dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          ) : !feesPaid ? (
            <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
                  <CreditCard className="size-4" />
                  School fees required
                </CardTitle>
                <CardDescription>
                  Every student who has paid school fees can register courses.
                  Status: <strong>{data.feeStatus || "Not paid"}</strong>.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link to="/school-fees">Pay school fees</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/dashboard">Back to dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <form
              className="grid gap-6 lg:grid-cols-[1fr_280px]"
              onSubmit={(e) => {
                e.preventDefault()
                void handleSubmit()
              }}
            >
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                      Select courses
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Courses for {departmentLabel} · Level {levelLabel}. Tick
                      this semester&apos;s units and any failed courses to
                      re-register.
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

                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline">{currentCount} this level</Badge>
                  <Badge variant="secondary">
                    <AlertTriangle className="size-3" />
                    {failedCount} failed / carry-over
                  </Badge>
                </div>

                {catalogLoading ? (
                  <Card className="border-dashed">
                    <CardContent className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      Loading courses…
                    </CardContent>
                  </Card>
                ) : filtered.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="py-10 text-center text-sm text-muted-foreground">
                      No courses for your department and level. Admin should
                      publish the catalog under Structure → Courses.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-2 rounded-xl border bg-card p-2 sm:p-3">
                    {filtered.map((course) => {
                      const key = courseKey(course.code)
                      const isOn = selected.has(key)
                      return (
                        <label
                          key={`${course.kind}-${course.id || course.code}`}
                          className={cn(
                            "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                            isOn
                              ? "border-cyan-600 bg-cyan-50/80 dark:bg-cyan-950/40"
                              : "hover:bg-muted/40",
                            course.kind === "failed" && !isOn
                              ? "border-amber-200/80 dark:border-amber-900/50"
                              : ""
                          )}
                        >
                          <input
                            type="checkbox"
                            className="mt-1 size-4 accent-cyan-700"
                            checked={isOn}
                            onChange={() => toggle(course.code)}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-sm font-semibold">
                                {course.code}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {course.units} units
                              </Badge>
                              {course.semester ? (
                                <Badge variant="secondary" className="text-xs">
                                  {course.semester} semester
                                </Badge>
                              ) : null}
                              {course.kind === "failed" && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Failed
                                  {course.priorGrade
                                    ? ` (${course.priorGrade})`
                                    : ""}{" "}
                                  — re-register
                                </Badge>
                              )}
                            </div>
                            <p className="mt-0.5 font-medium leading-snug">
                              {course.title}
                            </p>
                            {course.description ? (
                              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                {course.description}
                              </p>
                            ) : null}
                          </div>
                        </label>
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
                      Unit load
                    </CardTitle>
                    <CardDescription>
                      Cap set by admin for {departmentLabel} · Level{" "}
                      {levelLabel}
                      {!limitMatched ? " (using default)" : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-3xl font-bold tabular-nums">
                          {selectedUnits}
                          <span className="text-lg font-normal text-muted-foreground">
                            /{maxUnits}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selected.size} course
                          {selected.size === 1 ? "" : "s"} selected
                        </p>
                      </div>
                      {selectedUnits > maxUnits && (
                        <Badge variant="destructive">Over limit</Badge>
                      )}
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          selectedUnits > maxUnits
                            ? "bg-destructive"
                            : "bg-cyan-600"
                        )}
                        style={{
                          width: `${Math.min(
                            100,
                            (selectedUnits / Math.max(maxUnits, 1)) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    <ul className="max-h-56 space-y-1 overflow-y-auto text-sm">
                      {selected.size === 0 && (
                        <li className="text-muted-foreground">
                          Tick courses on the left
                        </li>
                      )}
                      {Array.from(selected).map((code) => {
                        const c = offers.find(
                          (x) => courseKey(x.code) === code
                        )
                        return (
                          <li
                            key={code}
                            className="flex items-center justify-between gap-2 rounded-md bg-muted/50 px-2 py-1.5"
                          >
                            <span className="truncate font-mono text-xs">
                              {code}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {c?.units ?? "—"}u
                              {c?.kind === "failed" ? " · F" : ""}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={
                        saving ||
                        selected.size === 0 ||
                        selectedUnits > maxUnits
                      }
                    >
                      {saving ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          <Check className="size-4" />
                          Submit registration
                        </>
                      )}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                      <IdCard className="mr-1 inline size-3" />
                      {hasMatric ? identity.matricNumber : "No matric"}
                      {" · "}
                      <GraduationCap className="mr-1 inline size-3" />
                      Level {levelLabel}
                    </p>
                  </CardContent>
                </Card>
              </aside>
            </form>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default CourseRegistration
