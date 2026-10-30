import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Bell,
  LogOut,
  Search,
  Settings,
  User,
} from "lucide-react"
import { signOut } from "firebase/auth"

import { ModeToggle } from "@/components/mode-toggle"
import { useDashboardContext } from "@/components/Auth/dashboard-context"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  listAnnouncements,
  type InstitutionAnnouncement,
} from "@/lib/announcements"
import { auth } from "@/lib/firebase"
import { cn } from "@/lib/utils"

const date = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
})

const SEARCH_LINKS: { label: string; path: string; keywords: string }[] = [
  { label: "Dashboard", path: "/dashboard", keywords: "home overview" },
  {
    label: "Course registration",
    path: "/registercourses",
    keywords: "courses enroll units",
  },
  { label: "Attendance", path: "/attendance", keywords: "class presence" },
  { label: "Exams schedule", path: "/exams-schedule", keywords: "timetable" },
  { label: "Assignments", path: "/assignments", keywords: "homework" },
  { label: "Results and GPA", path: "/results", keywords: "grades cgpa" },
  { label: "School fees", path: "/school-fees", keywords: "payment finance" },
  { label: "Receipts", path: "/receipts", keywords: "rrr payment" },
  { label: "e-Library", path: "/e-library", keywords: "books resources" },
  { label: "Hostel", path: "/hostel", keywords: "accommodation room" },
  { label: "Transcript", path: "/transcript", keywords: "records" },
  {
    label: "Announcements",
    path: "/announcement",
    keywords: "news notices",
  },
  { label: "Guardians", path: "/guardians", keywords: "parent invite" },
]

function TopBar({ title }: { title?: string }) {
  const { profile } = useDashboardContext()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [notices, setNotices] = useState<InstitutionAnnouncement[]>([])

  useEffect(() => {
    let cancelled = false
    void listAnnouncements()
      .then((list) => {
        if (!cancelled) setNotices(list.slice(0, 5))
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SEARCH_LINKS.slice(0, 6)
    return SEARCH_LINKS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q) ||
        item.path.toLowerCase().includes(q)
    ).slice(0, 8)
  }, [query])

  async function handleLogout() {
    await signOut(auth)
    navigate("/login", { replace: true })
  }

  return (
    <nav className="flex w-full items-center justify-between gap-3 px-2 py-1 sm:gap-4">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger />
        <div className="min-w-0 truncate text-base font-medium sm:text-lg">
          {title || `Welcome, ${profile.displayName}`}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <div className="mr-1 hidden rounded-xl border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground md:block">
          {date}
        </div>

        {/* Search */}
        <DropdownMenu open={searchOpen} onOpenChange={setSearchOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              className={cn(searchOpen && "bg-muted")}
            >
              <Search className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-2 sm:w-80">
            <div className="mb-2">
              <Input
                autoFocus
                placeholder="Search pages…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && results[0]) {
                    navigate(results[0].path)
                    setSearchOpen(false)
                    setQuery("")
                  }
                }}
              />
            </div>
            {results.length === 0 ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">
                No matches
              </p>
            ) : (
              results.map((item) => (
                <DropdownMenuItem
                  key={item.path}
                  onClick={() => {
                    navigate(item.path)
                    setSearchOpen(false)
                    setQuery("")
                  }}
                >
                  {item.label}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="size-4" />
              {notices.length > 0 ? (
                <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-cyan-500" />
              ) : null}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Announcements</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notices.length === 0 ? (
              <p className="px-2 py-4 text-center text-sm text-muted-foreground">
                No new announcements
              </p>
            ) : (
              notices.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  className="flex flex-col items-start gap-0.5 py-2"
                  onClick={() => navigate("/announcement")}
                >
                  <span className="font-medium">{n.title}</span>
                  <span className="line-clamp-1 text-xs text-muted-foreground">
                    {n.description || n.source}
                  </span>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/announcement">View all announcements</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dark mode (shadcn-style) */}
        <ModeToggle />

        {/* Settings */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <User className="size-4" />
              {profile.displayName}
            </DropdownMenuItem>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              Appearance
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={theme}
              onValueChange={(value) => {
                if (value === "light" || value === "dark" || value === "system") {
                  setTheme(value)
                }
              }}
            >
              <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void handleLogout()}>
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

export default TopBar
