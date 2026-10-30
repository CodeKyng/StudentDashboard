import {
  Award,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  Clock,
  FileText,
  LayoutDashboard,
  LogOut,
} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth"

import { useDashboardContext } from "@/components/Auth/dashboard-context"
import { useStaff } from "@/components/staff/staff-context"
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
    url: "/staff",
    icon: LayoutDashboard,
    items: [{ title: "Dashboard", url: "/staff", icon: LayoutDashboard }],
  },
  {
    title: "MY COURSES",
    url: "/staff",
    icon: BookOpen,
    items: [
      { title: "Course roster", url: "/staff", icon: BookOpen },
    ],
  },
  {
    title: "ACADEMIC DATA",
    url: "/staff/attendance",
    icon: ClipboardList,
    items: [
      { title: "Attendance", url: "/staff/attendance", icon: CalendarCheck },
      { title: "CA & Exam scores", url: "/staff/scores", icon: Award },
      { title: "Assignments", url: "/staff/assignments", icon: FileText },
      { title: "Exam schedule", url: "/staff/exams", icon: Clock },
    ],
  },
]

export function StaffSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useDashboardContext()
  const { selectedCourseCode } = useStaff()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const initials = profile.displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

  function href(path: string) {
    if (!selectedCourseCode) return path
    return `${path}?course=${encodeURIComponent(selectedCourseCode)}`
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
              <Link to={href("/staff")}>
                <div className="flex aspect-square size-8 items-center justify-center">
                  <img src="/unijos_logo.png" alt="" className="size-6" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">University of Jos</span>
                  <span>Staff portal</span>
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
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {initials || "ST"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {profile.displayName}
                    </span>
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
                      <AvatarFallback className="rounded-lg">
                        {initials || "ST"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {profile.displayName}
                      </span>
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
