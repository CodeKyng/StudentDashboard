import * as React from "react"
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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

// This is sample data.
const data = {
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
          url: "/dashboard/registercourses",
          icon: ClipboardList,
        },
        {
          title: "Attendance",
          url: "/dashboard/attendance",
          icon: CalendarCheck,
        },
        {
          title: "Exams Schedule",
          url: "/dashboard/exams-schedule",
          icon: Clock,
        },
        {
          title: "Assignment",
          url: "/dashboard/assignments",
          icon: FileCheck,
          badge: 3,
        },
        {
          title: "e-Library",
          url: "/dashboard/e-library",
          icon: Book,
        },
        {
          title: "Results and GPA",
          url: "/dashboard/results",
          icon: Award,
        },
      ],
    },
    {
      title: "FINANCE",
      url: "/finance",
      icon: CreditCard,
      items: [
        {
          title: "School Fees",
          url: "/school-fees",
          icon: ShieldCheck,
          badge: "Paid",
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
      url: "/services",
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
          badge: "4",
        },
      ],
    },
  ],
}

const name = "CodeKyng"
// const schoolFees = "Paid"
// const Announcement = 4
// const assignment = 0

export function SideBar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center text-sidebar-primary-foreground">
                  <img src="/unijos_logo.png" alt="Logo" className="size-6" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">University of Jos</span>
                  <span className="">University</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a
                    href={item.url}
                    className="flex items-center gap-3 font-medium"
                  >
                    {item.icon ? (
                      <item.icon className="size-5 text-sidebar-primary-foreground" />
                    ) : null}
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <div className="relative flex items-center">
                            <a
                              href={item.url}
                              className="flex items-center gap-2"
                            >
                              {item.icon ? (
                                <item.icon className="size-4 text-sidebar-primary-foreground" />
                              ) : null}
                              {item.title}
                            </a>
                            {item.badge &&
                            (item.title === "Assignment"
                              ? typeof item.badge !== "number" || item.badge > 0
                              : item.title === "Announcement"
                                ? true
                                : item.title === "School Fees"
                                  ? item.badge === "Paid" ||
                                    item.badge === "Pending"
                                  : false) ? (
                              <SidebarMenuBadge
                                className={
                                  item.title === "Assignment" ||
                                  item.title === "Announcement" ||
                                  item.title === "School Fees"
                                    ? "text-destructive-foreground bg-destructive"
                                    : "bg-blue-600 text-white"
                                }
                              >
                                {item.badge}
                              </SidebarMenuBadge>
                            ) : null}
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
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>UserName</AvatarFallback>
                  </Avatar>{" "}
                  {name}
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
