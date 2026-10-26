import { Outlet } from "react-router-dom"

import { AdminProvider, useAdminRecord } from "@/components/admin/admin-context"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { StudentPicker } from "@/components/admin/StudentPicker"
import TopBar from "@/components/layout/TopBar"
import { Button } from "@/components/ui/button"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"

function AdminFrame() {
  const { directoryError, dirty, saving, draft, save } = useAdminRecord()

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center border-b">
          <TopBar title="Administration" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {directoryError && (
            <p className="text-sm text-destructive" role="alert">
              {directoryError} Deploy the latest Firestore rules so staff can
              read the user directory.
            </p>
          )}
          <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 md:flex-row md:items-end md:justify-between">
            <StudentPicker />
            <div className="flex items-center gap-3">
              {dirty && (
                <span className="text-sm text-muted-foreground">
                  Unsaved changes
                </span>
              )}
              <Button
                type="button"
                disabled={!draft || !dirty || saving}
                onClick={() => void save()}
              >
                {saving ? "Saving..." : "Save record"}
              </Button>
            </div>
          </div>
          <Outlet />
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}

export function AdminShell() {
  return (
    <AdminProvider>
      <AdminFrame />
    </AdminProvider>
  )
}
