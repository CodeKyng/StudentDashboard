import type { ReactNode } from "react"

import { useAdminRecord } from "@/components/admin/admin-context"
import type { DashboardData } from "@/lib/dashboard-data"

export function RecordGate({
  children,
}: {
  children: (draft: DashboardData) => ReactNode
}) {
  const { selectedUid, selectedProfile, recordStatus, recordError, draft } =
    useAdminRecord()

  if (!selectedUid) {
    return (
      <p className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
        Select a student record above to edit this page.
      </p>
    )
  }

  if (recordStatus === "loading" || (recordStatus === "ready" && !draft)) {
    return (
      <p className="text-sm text-muted-foreground">Loading student record...</p>
    )
  }

  if (recordStatus === "error" || !draft) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {recordError || "This student record could not be loaded."}
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Editing {selectedProfile?.displayName ?? "student"}{" "}
        {selectedProfile ? `· ${selectedProfile.email}` : ""}
      </p>
      {children(draft)}
    </div>
  )
}
