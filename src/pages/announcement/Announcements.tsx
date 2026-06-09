import { SideBar } from "@/components/layout/SideBar"
import TopBar from "@/components/layout/TopBar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const announcements = [
  {
    id: "ann-1",
    source: "Registry",
    dateCreated: "09 June 2026",
    title: "Semester Registration Deadline Extended",
    description:
      "The registration portal closing date has been extended to June 20. Please complete your course registration before the new deadline.",
    badge: "Important",
  },
  {
    id: "ann-2",
    source: "Library",
    dateCreated: "08 June 2026",
    title: "Library Resource Access Update",
    description:
      "New online resources have been added to the university library portal. Check your student account for access instructions and borrowing policies.",
    badge: "Update",
  },
]

function Announcements() {
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
            {announcements.map((announcement) => (
              <Card
                key={announcement.id}
                className="flex flex-col items-center justify-center h-40"
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
