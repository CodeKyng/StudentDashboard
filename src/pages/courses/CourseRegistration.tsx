import { SideBar } from "@/components/layout/SideBar"
import TopBar from "@/components/layout/TopBar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import CourseCatalog from "./CourseCatalog"
import { useDashboardContext } from "@/components/Auth/dashboard-context"

function CourseRegistration() {
  const { data } = useDashboardContext()

  return (
    <SidebarProvider>
      <SideBar />
      <SidebarInset>
        <TopBar />
        <main className="p-4">
          <div className="rounded-3xl border border-border bg-background p-8 shadow-sm">
            <CourseCatalog
              courses={data.courseCatalog}
              registrationEligible={data.registrationEligible}
            />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default CourseRegistration
