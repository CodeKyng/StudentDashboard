import { SideBar } from "@/components/layout/SideBar"
import TopBar from "@/components/layout/TopBar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDashboardContext } from "@/components/Auth/dashboard-context"

function Announcements() {
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
          <div className="grid gap-4">
            {data.announcements.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No announcements are available in Firebase.
              </p>
            )}
            {data.announcements.map((announcement) => (
              <Card
                key={announcement.id}
                className="flex h-40 flex-col items-center justify-center"
              >
                <CardHeader>
                  <CardTitle className="flex w-full items-center justify-between gap-3">
                    <Badge>{announcement.badge}</Badge>
                    <div className="flex flex-row gap-3 text-sm text-white">
                      <span>{announcement.source}</span>
                      <span>{announcement.dateCreated}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  <h1 className="mt-1 mb-1 text-center text-lg font-semibold">
                    {announcement.title}
                  </h1>
                  <p className="mt-1 mb-1 max-w-2xl text-center text-white">
                    {announcement.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Announcements
