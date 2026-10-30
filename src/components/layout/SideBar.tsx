import * as React from "react"
import { Link } from "react-router-dom"
import {
  Award,
  Book,
  BookOpen,
  CalendarCheck,
  CreditCard,
  FileCheck,
  FileSearch,
  FileText,
  Home,
  LayoutDashboard,
  LifeBuoy,
  Megaphone,
  ShieldCheck,
  Clock,
  ClipboardList,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { useDashboardContext } from "@/components/Auth/dashboard-context"

const navigation = {
  navMain: [
    {
      title: "ACADEMIC",
      url: "/dashboard",
      icon: BookOpen,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Course Registration",
          url: "/registercourses",
          icon: ClipboardList,
        },
        {
          title: "Attendance",
          url: "/attendance",
          icon: CalendarCheck,
        },
        {
          title: "Exams Schedule",
          url: "/exams-schedule",
          icon: Clock,
        },
        {
          title: "Assignment",
          url: "/assignments",
          icon: FileCheck,
          badge: "assignments",
        },
        {
          title: "e-Library",
          url: "/e-library",
          icon: Book,
        },
        {
          title: "Results and GPA",
          url: "/results",
          icon: Award,
        },
      ],
    },
    {
      title: "FINANCE",
      url: "/schoolfees",
      icon: CreditCard,
      items: [
        {
          title: "School Fees",
          url: "/school-fees",
          icon: ShieldCheck,
          badge: "fees",
        },
        {
          title: "Receipts",
          url: "/receipts",
          icon: FileText,
        },
      ],
    },
    {
      title: "SERVICES",
      url: "/hostel",
      icon: LifeBuoy,
      items: [
        {
          title: "Hostel",
          url: "/hostel",
          icon: Home,
        },
        {
          title: "Transcript",
          url: "/transcript",
          icon: FileSearch,
        },
        {
          title: "Announcement",
          url: "/announcement",
          icon: Megaphone,
          badge: "announcements",
        },
        {
          title: "Guardians",
          url: "/guardians",
          icon: Users,
        },
      ],
    },
  ],
}

export function SideBar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, profile } = useDashboardContext()
  const userInitials = profile.displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center text-sidebar-primary-foreground">
                  <img src="/unijos_logo.png" alt="Logo" className="size-6" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">University of Jos</span>
                  <span className="">University</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navigation.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    to={item.url}
                    className="flex items-center gap-3 font-medium"
                  >
                    {item.icon ? (
                      <item.icon className="size-5 text-sidebar-primary-foreground" />
                    ) : null}
                    {item.title}
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <div className="relative flex items-center">
                            <Link
                              to={item.url}
                              className="flex items-center gap-2"
                            >
                              {item.icon ? (
                                <item.icon className="size-4 text-sidebar-primary-foreground" />
                              ) : null}
                              {item.title}
                            </Link>
                            {(() => {
                              const badge =
                                item.badge === "assignments"
                                  ? data.assignments.filter(
                                      (assignment) =>
                                        assignment.status === "Pending"
                                    ).length
                                  : item.badge === "fees"
                                    ? data.feeStatus
                                    : item.badge === "announcements"
                                      ? data.unreadAnnouncementCount
                                      : undefined
                              if (
                                badge === undefined ||
                                badge === 0 ||
                                badge === ""
                              ) {
                                return null
                              }
                              return (
                                <SidebarMenuBadge className="text-destructive-foreground bg-destructive">
                                  {badge}
                                </SidebarMenuBadge>
                              )
                            })()}
                          </div>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
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
                    <AvatarFallback>{userInitials || "U"}</AvatarFallback>
                  </Avatar>{" "}
                  {profile.displayName}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>LogOut</DropdownMenuItem>
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
