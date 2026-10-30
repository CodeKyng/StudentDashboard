import { useState } from "react"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Select,
  SelectItem,
  SelectGroup,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Check, Layers, Loader2 } from "lucide-react"

import { useDashboardContext } from "@/components/Auth/dashboard-context"
import type { Course, DashboardCourse } from "@/lib/dashboard-data"
import { getAuthErrorMessage } from "@/lib/auth"
import { saveRegisteredCourses } from "@/lib/student-data"

const maxUnits = 18

interface CourseCatalogProps {
  courses: Course[]
  registrationEligible?: boolean
}

function CourseCatalog({ courses, registrationEligible }: CourseCatalogProps) {
  const { profile, setData, refresh } = useDashboardContext()
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<string>(
    courses[0]?.department ?? ""
  )
  const departments = Array.from(
    new Map(
      courses.map(
        (course) => [course.department, course.departmentName] as const
      )
    ),
    ([value, label]) => ({ value, label })
  )

  const handleCourseClick = (courseCode: string) => {
    const next = new Set(selectedCourses)
    if (next.has(courseCode)) next.delete(courseCode)
    else next.add(courseCode)
    setSelectedCourses(next)
  }

  const filteredCourses = courses.filter(
    (course) => course.department === selectedDepartment
  )
  const noOfUnits = Array.from(selectedCourses).reduce((total, code) => {
    const course = courses.find((c) => c.code === code)
    return total + (course?.units || 0)
  }, 0)

  async function handleSubmitRegistration() {
    if (registrationEligible !== true) {
      toast.error("You are not eligible to register courses yet.")
      return
    }
    if (selectedCourses.size === 0) {
      toast.error("Select at least one course.")
      return
    }
    if (noOfUnits > maxUnits) {
      toast.error(`You cannot exceed ${maxUnits} units.`)
      return
    }
    const enrolled: DashboardCourse[] = Array.from(selectedCourses)
      .map((code) => courses.find((c) => c.code === code))
      .filter((c): c is Course => Boolean(c))
      .map((c) => ({
        code: c.code,
        title: c.name,
        description: c.description,
        progress: 0,
      }))
    setSaving(true)
    try {
      await saveRegisteredCourses(profile.uid, enrolled)
      setData((prev) => ({ ...prev, courses: enrolled }))
      toast.success("Course registration saved.")
      await refresh()
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Tabs defaultValue="isEligible" className="h-auto w-full">
      <TabsList>
        <TabsTrigger value="isEligible">Selected Courses</TabsTrigger>
        <TabsTrigger value="downloadForm">Download Course Form</TabsTrigger>
      </TabsList>
      <TabsContent value="isEligible">
        <Card className="w-full">
          <CardHeader />
          <CardContent>
            <Alert>
              <AlertDescription>
                {registrationEligible === true
                  ? "You are eligible to register courses for this session."
                  : "Registration is locked until an administrator marks you eligible."}
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Department</SelectLabel>
                    {departments.map((department) => (
                      <SelectItem
                        key={department.value}
                        value={department.value}
                      >
                        {department.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-md border bg-secondary p-4">
              <Layers className="size-4" />
              Selected: {noOfUnits} / {maxUnits} units · {selectedCourses.size}{" "}
              courses
            </div>
          </CardContent>
          <CardFooter className="flex h-auto w-full flex-col gap-4">
            <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
              {filteredCourses.length === 0 && (
                <p className="col-span-2 text-sm text-muted-foreground">
                  No courses in the catalog for this department.
                </p>
              )}
              {filteredCourses.map((course) => (
                <Button
                  key={course.code}
                  type="button"
                  onClick={() => handleCourseClick(course.code)}
                  disabled={registrationEligible !== true}
                  variant={
                    selectedCourses.has(course.code) ? "default" : "secondary"
                  }
                  className="h-auto justify-start gap-2 p-2"
                >
                  <div className="text-left">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold">{course.code}</span>
                      <span className="text-xs text-muted-foreground">
                        {course.units} units · {course.semester}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{course.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {course.description}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
            <div className="mt-auto flex w-full items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-1/2"
                onClick={() => setSelectedCourses(new Set())}
              >
                <ArrowLeft className="size-4" /> Clear
              </Button>
              <Button
                type="button"
                className="w-1/2"
                disabled={
                  registrationEligible !== true ||
                  saving ||
                  selectedCourses.size === 0 ||
                  noOfUnits > maxUnits
                }
                onClick={() => void handleSubmitRegistration()}
              >
                {saving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Saving…
                  </>
                ) : (
                  <>
                    Submit registration <Check className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="downloadForm">
        <div className="flex h-64 w-full flex-col items-center justify-center rounded-md border bg-secondary p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Course form download will be available after department approval.
          </p>
          <Button variant="outline" className="mt-4" disabled>
            Download form
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}

export default CourseCatalog
