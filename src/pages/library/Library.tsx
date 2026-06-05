import { SideBar } from "@/components/layout/SideBar"
import TopBar from "@/components/layout/TopBar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Satellite } from "lucide-react"

function Library() {
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
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Welcome to the Library! Here you can access a wide range of
                academic resources, including e-books, research papers, and
                journals. Use the search bar to find materials related to your
                courses and research interests. Happy studying!
              </p>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Library
