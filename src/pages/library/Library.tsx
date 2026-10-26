import { SideBar } from "@/components/layout/SideBar"
import TopBar from "@/components/layout/TopBar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Satellite } from "lucide-react"
import { useDashboardContext } from "@/components/Auth/dashboard-context"

function Library() {
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
          <Card className="rounded-3xl border border-border bg-background p-8 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Satellite size={18} />
                Library
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.libraryResources.length ? (
                data.libraryResources.map((resource) => (
                  <article
                    key={`${resource.title}-${resource.author}`}
                    className="rounded-md border p-4"
                  >
                    <h2 className="font-semibold">{resource.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {resource.author} · {resource.category}
                    </p>
                    {/^https?:\/\//i.test(resource.url) && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-sm text-primary underline"
                      >
                        Open resource
                      </a>
                    )}
                  </article>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No library resources are available in Firebase.
                </p>
              )}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Library
