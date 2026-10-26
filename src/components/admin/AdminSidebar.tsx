import {
  Award,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Clock,
  CreditCard,
  FileSearch,
  FileText,
  Home,
  LayoutDashboard,
  Library,
  LogOut,
  Megaphone,
  ShieldCheck,
  Users,
} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"

import { useDashboardContext } from "@/components/Auth/dashboard-context"
import { useAdminRecord } from "@/components/admin/admin-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { auth } from "@/lib/firebase"

const sections = [
  {
    title: "OVERVIEW",
    url: "/admin",
    icon: LayoutDashboard,
    items: [
      { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
      { title: "Directory", url: "/admin/students", icon: Users },
      { title: "Student profile", url: "/admin/profile", icon: ShieldCheck },
    ],
  },
  {
    title: "ACADEMIC",
    url: "/admin/courses",
    icon: BookOpen,
    items: [
      { title: "Courses", url: "/admin/courses", icon: ClipboardList },
      { title: "Attendance", url: "/admin/attendance", icon: CalendarCheck },
      { title: "Exams", url: "/admin/exams", icon: Clock },
      { title: "Assignments", url: "/admin/assignments", icon: FileText },
      { title: "Results", url: "/admin/results", icon: Award },
    ],
  },
  {
    title: "FINANCE",
    url: "/admin/fees",
    icon: CreditCard,
    items: [
      { title: "Fees", url: "/admin/fees", icon: CreditCard },
      { title: "Receipts", url: "/admin/receipts", icon: FileText },
    ],
  },
  {
    title: "SERVICES",
    url: "/admin/hostel",
    icon: Home,
    items: [
      { title: "Hostel", url: "/admin/hostel", icon: Home },
      { title: "Library", url: "/admin/library", icon: Library },
      { title: "Transcript", url: "/admin/transcript", icon: FileSearch },
      { title: "Announcements", url: "/admin/announcements", icon: Megaphone },
    ],
  },
]

export function AdminSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  const { profile } = useDashboardContext()
  const { selectedUid } = useAdminRecord()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const initials = profile.displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

  function href(path: string) {
    return selectedUid
      ? `${path}?student=${encodeURIComponent(selectedUid)}`
      : path
  }

  async function handleLogout() {
    await signOut(auth)
    navigate("/login", { replace: true })
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={href("/admin")}>
                <div className="flex aspect-square size-8 items-center justify-center">
                  <img src="/unijos_logo.png" alt="" className="size-6" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">University of Jos</span>
                  <span>Administration</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {sections.map((section) => (
              <SidebarMenuItem key={section.title}>
                <SidebarMenuButton asChild isActive={pathname === section.url}>
                  <Link to={href(section.url)} className="font-medium">
                    <section.icon />
                    {section.title}
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {section.items.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={pathname === item.url}
                      >
                        <Link to={href(item.url)}>
                          <item.icon />
                          {item.title}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar>
                    <AvatarFallback>{initials || "A"}</AvatarFallback>
                  </Avatar>
                  {profile.displayName}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    {profile.role} account
                  </DropdownMenuLabel>
                  <DropdownMenuItem disabled>{profile.email}</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => void handleLogout()}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
