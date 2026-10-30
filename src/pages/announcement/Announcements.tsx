import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Loader2, Megaphone } from "lucide-react"

import { SideBar } from "@/components/layout/SideBar"
import TopBar from "@/components/layout/TopBar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getAuthErrorMessage } from "@/lib/auth"
import {
  listAnnouncements,
  type InstitutionAnnouncement,
} from "@/lib/announcements"

function Announcements() {
  const [items, setItems] = useState<InstitutionAnnouncement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      try {
        const list = await listAnnouncements()
        if (!cancelled) setItems(list)
      } catch (error) {
        if (!cancelled) toast.error(getAuthErrorMessage(error))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <SidebarProvider>
      <SideBar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <TopBar title="Announcements" />
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl space-y-4 p-4 md:p-6">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
              <Megaphone className="size-5" />
              Campus announcements
            </h1>
            <p className="text-sm text-muted-foreground">
              Official notices from the university administration.
            </p>
          </div>

          {loading ? (
            <Card className="border-dashed">
              <CardContent className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading announcements…
              </CardContent>
            </Card>
          ) : items.length === 0 ? (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>No announcements</CardTitle>
                <CardDescription>
                  When admin publishes a notice, it will appear here.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="space-y-3">
              {items.map((announcement) => (
                <Card key={announcement.id}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{announcement.badge}</Badge>
                      {announcement.pinned ? <Badge>Pinned</Badge> : null}
                      <span className="text-xs text-muted-foreground">
                        {announcement.source} · {announcement.dateCreated}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {announcement.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Announcements
