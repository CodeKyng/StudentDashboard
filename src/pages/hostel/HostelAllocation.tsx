import { SideBar } from "@/components/layout/SideBar"
import TopBar from "@/components/layout/TopBar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
    Card,
  CardContent,
} from "@/components/ui/card"
import { Speaker } from "lucide-react"



function HostelAllocation() {
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
          <Card className="flex flex-col items-center justify-center ">
            <CardContent className="flex flex-col items-center justify-center " >
                <Speaker className="mt-2 mb-2" />
                <h1 className="mt-2 mb-2">Hostel</h1>
                <p className="mt-2 mb-2">
                    This section is available in full build
                </p>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default HostelAllocation