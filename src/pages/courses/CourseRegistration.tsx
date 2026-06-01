import { SideBar } from "@/components/layout/SideBar"
import TopBar from "@/components/layout/TopBar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import CourseCatalog from "./CourseCatalog"

function CourseRegistration() {
  return (
    <SidebarProvider>
      <SideBar />
      <SidebarInset>
        <TopBar />
        <main className="p-4">
          <div className="rounded-3xl border border-border bg-background p-8 shadow-sm">
            <CourseCatalog />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default CourseRegistration
