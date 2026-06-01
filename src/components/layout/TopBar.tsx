import { Bell, Search, Settings } from "lucide-react"
import { SidebarTrigger } from "../ui/sidebar"

const name = "CodeKyng"
const date = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
})
function TopBar() {
  return (
    <nav className="flex items-center gap-4 px-4 py-3 pr-6 md:px-6 md:py-4 md:pr-8 lg:px-8 lg:pr-12">
      {/* Left - Sidebar Trigger */}
      <SidebarTrigger />

      {/* Middle - Welcome Message (grows on larger screens) */}
      <div className="hidden text-lg font-medium sm:block">
        Welcome to your dashboard {name}
      </div>

      {/* Spacer - takes up remaining space to push right section to the edge */}
      <div className="flex-1" />

      {/* Right - Date, Search, Bell, Settings */}
      <div className="ml-auto flex items-center gap-2 md:gap-4">
        <div className="hidden rounded-xl bg-white/10 px-3 py-2 text-sm md:flex md:px-4 md:py-2">
          <span>{date}</span>
        </div>
        <Search className="size-5 cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted md:size-7" />
        <Bell className="size-5 cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted md:size-7" />
        <Settings className="size-5 cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted md:size-7" />
      </div>
    </nav>
  )
}

export default TopBar
