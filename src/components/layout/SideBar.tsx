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
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Dashboard",
          url: "#",
          icon: LayoutDashboard,
        },
        {
          title: "Course Registration",
          url: "#",
          icon: ClipboardList,
        },
        {
          title: "Attendance",
          url: "#",
          icon: CalendarCheck,
        },
        {
          title: "Exams Schedule",
          url: "#",
          icon: Clock,
        },
        {
          title: "Assignment",
          url: "#",
          icon: FileCheck,
          badge: 3,
        },
        {
          title: "e-Library",
          url: "#",
          icon: Book,
        },
        {
          title: "Results and GPA",
          url: "#",
          icon: Award,
        },
      ],
    },
    {
      title: "FINANCE",
      url: "#",
      icon: CreditCard,
      items: [
        {
          title: "School Fees",
          url: "#",
          icon: ShieldCheck,
          badge: "Paid",
        },
        {
          title: "Receipts",
          url: "#",
          icon: FileText,
        },
      ],
    },
    {
      title: "SERVICES",
      url: "#",
      icon: LifeBuoy,
      items: [
        {
          title: "Hostel",
          url: "#",
          icon: Home,
        },
        {
          title: "Transcript",
          url: "#",
          icon: FileSearch,
        },
        {
          title: "Announcement",
          url: "#",
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
