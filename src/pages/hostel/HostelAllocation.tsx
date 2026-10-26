import { SideBar } from "@/components/layout/SideBar"
import TopBar from "@/components/layout/TopBar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboardContext } from "@/components/Auth/dashboard-context"

function HostelAllocation() {
  const { data } = useDashboardContext()

  return (
    <SidebarProvider>
      <SideBar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <TopBar />
          </div>
        </header>

        <main className="p-4">
          <Card className="flex flex-col items-center justify-center">
            <CardHeader>
              <CardTitle>Hostel Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              {data.hostelAssignment ? (
                <dl className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm text-muted-foreground">Hostel</dt>
                    <dd className="font-medium">
                      {data.hostelAssignment.hostel}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Room</dt>
                    <dd className="font-medium">
                      {data.hostelAssignment.room}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Session</dt>
                    <dd className="font-medium">
                      {data.hostelAssignment.session}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Status</dt>
                    <dd className="font-medium">
                      {data.hostelAssignment.status}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hostel allocation is available in Firebase.
                </p>
              )}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default HostelAllocation
