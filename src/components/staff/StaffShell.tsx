import { Outlet } from "react-router-dom"

import { StaffProvider, useStaff } from "@/components/staff/staff-context"
import { StaffSidebar } from "@/components/staff/StaffSidebar"
import TopBar from "@/components/layout/TopBar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { Badge } from "@/components/ui/badge"

function CourseBar() {
  const {
    courses,
    coursesStatus,
    selectedCourseCode,
    selectCourse,
    roster,
    rosterStatus,
  } = useStaff()

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 md:flex-row md:items-end md:justify-between">
      <label className="grid w-full max-w-xl gap-1.5 text-sm font-medium">
        Active course
        <select
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm font-normal"
          value={selectedCourseCode}
          disabled={coursesStatus !== "ready"}
          onChange={(e) => selectCourse(e.target.value)}
        >
          <option value="">
            {coursesStatus === "loading"
              ? "Loading courses…"
              : "Select a course to manage"}
          </option>
          {courses.map((c) => (
            <option key={c.id} value={c.code}>
              {c.code} — {c.title} ({c.units}u · {c.level || "—"} ·{" "}
              {c.semester || "—"})
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {selectedCourseCode && (
          <>
            <Badge variant="secondary">{selectedCourseCode}</Badge>
            <span>
              {rosterStatus === "loading"
                ? "Loading roster…"
                : `${roster.length} student${roster.length === 1 ? "" : "s"} on roster`}
            </span>
          </>
        )}
      </div>
    </div>
  )
}

function StaffFrame() {
  const { coursesError } = useStaff()

  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center border-b">
          <TopBar title="Staff portal" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {coursesError && (
            <p className="text-sm text-destructive" role="alert">
              {coursesError}
            </p>
          )}
          <CourseBar />
          <Outlet />
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}

export function StaffShell() {
  return (
    <StaffProvider>
      <StaffFrame />
    </StaffProvider>
  )
}
