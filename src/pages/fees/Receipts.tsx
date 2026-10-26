import { SideBar } from "@/components/layout/SideBar"
import TopBar from "@/components/layout/TopBar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboardContext } from "@/components/Auth/dashboard-context"

function Receipts() {
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
              <CardTitle>Receipts</CardTitle>
            </CardHeader>
            <CardContent className="w-full space-y-3">
              {data.paymentRecords.length ? (
                data.paymentRecords.map((record) => (
                  <div
                    key={`${record.rrr}-${record.date}`}
                    className="flex flex-wrap justify-between gap-2 rounded-md border p-4"
                  >
                    <div>
                      <p className="font-medium">RRR {record.rrr}</p>
                      <p className="text-sm text-muted-foreground">
                        {record.session} · Level {record.level} · {record.date}
                      </p>
                    </div>
                    <p>{record.status}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  No receipt records are available in Firebase.
                </p>
              )}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Receipts
