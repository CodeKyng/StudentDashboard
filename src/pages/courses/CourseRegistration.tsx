import { SideBar } from "@/components/layout/SideBar"
import TopBar from "@/components/layout/TopBar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import CourseCatalog from "./CourseCatalog"
import type { Course } from "./CourseCatalog"

interface CourseRegistrationProps {
  courses: Course[]
}

function CourseRegistration({ courses }: CourseRegistrationProps) {
  return (
    <SidebarProvider>
      <SideBar />
      <SidebarInset>
        <TopBar />
        <main className="p-4">
          <div className="rounded-3xl border border-border bg-background p-8 shadow-sm">
            <CourseCatalog courses={courses} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default CourseRegistration
