import { SideBar } from "@/components/layout/SideBar"
import TopBar from "@/components/layout/TopBar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Megaphone,
  TrendingDown,
  TrendingUp,
} from "lucide-react"

const cgpa = 3.75
const previousCgpa = 3.55
const cgpaChange = cgpa - previousCgpa
const cgpaIsIncreasing = cgpaChange >= 0
const cgpaPercentage = Math.abs((cgpaChange / previousCgpa) * 100)
const cgpaTrendLabel = cgpaIsIncreasing ? "increase" : "decrease"

const warningPercentage = 75
const warningIsPositive = warningPercentage >= 0

const attendancePercentage = 95

const courses = [
  {
    code: "CS101",
    title: "Introduction to Computer Science",
    description: "Basic concepts of programming and algorithms.",
    progress: 88,
  },
  {
    code: "MATH201",
    title: "Calculus II",
    description: "Advanced topics in differential and integral calculus.",
    progress: 76,
  },
  {
    code: "PHYS101",
    title: "General Physics I",
    description: "Fundamentals of mechanics and thermodynamics.",
    progress: 91,
  },
  {
    code: "ENG101",
    title: "Technical Writing",
    description: "Developing clear and effective technical documentation.",
    progress: 82,
  },
  {
    code: "ECON201",
    title: "Microeconomics",
    description:
      "Analysis of individual economic behavior and market structures.",
    progress: 79,
  },
  {
    code: "CHEM101",
    title: "General Chemistry",
    description: "Introduction to chemical principles and laboratory methods.",
    progress: 84,
  },
  {
    code: "BIO101",
    title: "Biology I",
    description: "Cell biology, genetics, and evolution fundamentals.",
    progress: 87,
  },
  {
    code: "STAT202",
    title: "Statistics for Engineers",
    description:
      "Probability, statistical inference, and data analysis techniques.",
    progress: 93,
  },
  {
    code: "HIST101",
    title: "African History",
    description: "A survey of African societies, cultures, and history.",
    progress: 68,
  },
  {
    code: "PSY101",
    title: "Introduction to Psychology",
    description:
      "Human behavior, cognition, and foundational psychological principles.",
    progress: 74,
  },
  {
    code: "SOCI201",
    title: "Sociology",
    description:
      "Study of social systems, interaction, and community structures.",
    progress: 79,
  },
  {
    code: "IT201",
    title: "Database Systems",
    description:
      "Design, implementation, and management of relational databases.",
    progress: 88,
  },
]

const announcements = [
  {
    title: "Midterm Exams Schedule",
    description:
      "Please note the updated schedule for the upcoming midterm exams.",
  },
  {
    title: "Library Hours Extended",
    description: "The library will now have extended hours during exam week.",
  },
  {
    title: "Guest Lecture on AI",
    description:
      "Join the guest lecture on artificial intelligence this Friday.",
  },
  {
    title: "Sports Meet Registration",
    description: "Register now for the upcoming university sports meet.",
  },
  {
    title: "Scholarship Application",
    description: "Applications for the new scholarship program are now open.",
  },
]

const events = [
  {
    title: "Career Fair",
    description:
      "Network with potential employers and explore career opportunities.",
  },
  {
    title: "Workshop on Technical Skills",
    description: "Enhance your technical skills with hands-on workshops.",
  },
  {
    title: "Hackathon Weekend",
    description: "Team up and build innovative solutions in 48 hours.",
  },
  {
    title: "Research Symposium",
    description: "Share your research insights with faculty and peers.",
  },
  {
    title: "Health Awareness Camp",
    description: "Free health screenings and wellness sessions for students.",
  },
]

const numberOfCourses = courses.length
const session = "2023/2024 . 400LVL . Computer Engineering"

export default function StudentDashboard() {
  return (
    <SidebarProvider>
      <SideBar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <TopBar />
          </div>
        </header>
        <div className="flex items-stretch gap-4 p-4">
          <Card className="flex h-full min-h-[220px] flex-1 flex-col">
            <CardHeader>
              <CardTitle>CGPA</CardTitle>
              <CardDescription>
                Current Cumulative Grade Point Average
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-5xl font-bold">{cgpa}</p>
            </CardContent>
            <CardFooter className="mt-auto">
              <div className="flex items-center gap-2 text-sm font-medium">
                {cgpaIsIncreasing ? (
                  <TrendingUp className="size-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="size-4 text-destructive" />
                )}
                <span
                  className={
                    cgpaIsIncreasing ? "text-emerald-500" : "text-destructive"
                  }
                >
                  {cgpaIsIncreasing ? "+" : "-"}
                  {cgpaPercentage.toFixed(1)}%
                </span>
                <span className="text-muted-foreground">
                  {cgpaTrendLabel} from last semester
                </span>
              </div>
            </CardFooter>
          </Card>
          <Card className="flex h-full min-h-[220px] flex-1 flex-col">
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
              <CardDescription>
                If you are below 75%, you will receive a warning.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div>
                <p className="text-5xl font-bold">{attendancePercentage}%</p>
                <div className="mt-4">
                  <Progress value={attendancePercentage} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="mt-auto">
              <p
                className={
                  warningIsPositive
                    ? "text-sm font-medium text-emerald-500"
                    : "text-sm font-medium text-destructive"
                }
              >
                {warningPercentage}% below Warning!
              </p>
            </CardFooter>
          </Card>
          <Card className="flex h-full min-h-[220px] flex-1 flex-col">
            <CardHeader>
              <CardTitle>Courses</CardTitle>
              <CardDescription>Currently enrolled courses</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-5xl font-bold">{numberOfCourses}</p>
            </CardContent>
            <CardFooter className="mt-auto">
              <p>For this semester</p>
            </CardFooter>
          </Card>
          <Card className="flex h-full min-h-[220px] flex-1 flex-col">
            <CardHeader>
              <CardTitle>Fees Status</CardTitle>
              <CardDescription>Current fees status</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-5xl font-bold text-red-900">Paid</p>
            </CardContent>
            <CardFooter className="mt-auto">
              <p>Current Status: Paid</p>
            </CardFooter>
          </Card>
        </div>
        <div className="flex w-full items-stretch gap-4 p-4">
          <Card className="flex h-full min-h-[220px] max-w-[600px] flex-1 flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <BookOpen />
                  <span>My Courses</span>
                </div>
                <span className="flex text-green-700">
                  Register <ArrowRight />
                </span>
              </CardTitle>
            </CardHeader>
            <ScrollArea className="h-[600px] w-full rounded-md p-4">
              <CardContent>
                <div>
                  {courses.map((course, index) => (
                    <div key={index} className="mb-4">
                      <p className="font-bold">{course.code}</p>
                      <p className="text-lg font-semibold">{course.title}</p>
                      <p className="text-muted-foreground">
                        {course.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </ScrollArea>
          </Card>
          <div>
            <Card className="flex h-full max-h-[240px] w-[500px] flex-col">
              <CardHeader className="flex items-center justify-center border-b text-xl font-bold">
                <CardTitle>School Fees</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="flex items-center justify-center text-3xl font-bold">
                  ₦150,000
                </p>
                <p className="mt-4 block text-sm text-muted-foreground">
                  {session}
                </p>
              </CardContent>
              <CardFooter className="mt-auto flex items-center justify-center gap-2">
                <Button>Pay via Remita</Button>
              </CardFooter>
            </Card>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck />
                    Attendance{" "}
                  </div>
                  <span className="text-sm font-normal text-green-800">
                    Details
                  </span>
                </CardTitle>
              </CardHeader>
              <ScrollArea className="h-[350px] w-full rounded-md p-4">
                <CardContent className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course.code}
                      className="space-y-2 rounded-lg border border-border bg-background/70 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold">{course.code}</p>
                          <p className="text-sm text-muted-foreground">
                            {course.title}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          {course.progress}%
                        </span>
                      </div>
                      <Progress value={course.progress} />
                    </div>
                  ))}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
        </div>
        <div className="flex w-full items-stretch gap-4 p-4">
          <Card className="flex h-full min-h-[220px] max-w-[550px] flex-1 flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Megaphone />
                  <span>Announcements</span>
                </div>
                <span className="flex text-green-700">All</span>
              </CardTitle>
            </CardHeader>
            <ScrollArea className="w-full rounded-md p-4">
              <CardContent>
                <div>
                  {announcements.map((announcement, index) => (
                    <div key={index} className="mb-4">
                      <p className="font-bold">{announcement.title}</p>
                      <p className="text-muted-foreground">
                        {announcement.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </ScrollArea>
          </Card>
          <Card className="flex h-full min-h-[220px] max-w-[550px] flex-1 flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar />
                <span>Upcoming Events</span>
              </CardTitle>
            </CardHeader>
            <ScrollArea className="w-full rounded-md p-4">
              <CardContent>
                <div>
                  {events.map((event, index) => (
                    <div key={index} className="mb-4">
                      <p className="font-bold">{event.title}</p>
                      <p className="text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </ScrollArea>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
