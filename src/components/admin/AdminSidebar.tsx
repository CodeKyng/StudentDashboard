import {
  Award,
  BookOpen,
  BookUser,
  Building,
  Building2,
  CalendarCheck,
  ClipboardList,
  Clock,
  CreditCard,
  FileSearch,
  FileText,
  Home,
  IdCard,
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
    items: [{ title: "Dashboard", url: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "STRUCTURE",
    url: "/admin/faculties",
    icon: Building2,
    items: [
      { title: "Faculties", url: "/admin/faculties", icon: Building2 },
      { title: "Departments", url: "/admin/departments", icon: Building },
      { title: "Courses", url: "/admin/courses", icon: BookOpen },
    ],
  },
  {
    title: "STUDENTS",
    url: "/admin/students",
    icon: Users,
    items: [
      { title: "Directory & matric", url: "/admin/students", icon: IdCard },
      { title: "Staff manager", url: "/admin/staff-manager", icon: BookUser },
      { title: "Student profile", url: "/admin/profile", icon: ShieldCheck },
    ],
  },
  {
    title: "ACADEMIC",
    url: "/admin/attendance",
    icon: ClipboardList,
    items: [
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

export function AdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
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
    const structure = [
      "/admin",
      "/admin/faculties",
      "/admin/departments",
      "/admin/courses",
      "/admin/students",
      "/admin/staff-manager",
    ]
    if (structure.includes(path) || !selectedUid) return path
    return `${path}?student=${encodeURIComponent(selectedUid)}`
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
                <SidebarMenuButton
                  asChild
                  isActive={
                    pathname === section.url ||
                    section.items.some((item) => pathname === item.url)
                  }
                >
                  <Link to={href(section.url)} className="font-medium">
                    <section.icon />
                    {section.title}
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {section.items.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton asChild isActive={pathname === item.url}>
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
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">{initials || "AD"}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{profile.displayName}</span>
                    <span className="truncate text-xs">{profile.role}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="size-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">{initials || "AD"}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{profile.displayName}</span>
                      <span className="truncate text-xs">{profile.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => void handleLogout()}>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
