import { useState } from "react"
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
import { ArrowLeft, BadgeCheck, Check, Layers } from "lucide-react"

import type { Course } from "@/lib/dashboard-data"

const maxUnits = 18

interface CourseCatalogProps {
  courses: Course[]
  registrationEligible?: boolean
}

function CourseCatalog({ courses, registrationEligible }: CourseCatalogProps) {
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set())
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
    const newSelected = new Set(selectedCourses)
    if (newSelected.has(courseCode)) {
      newSelected.delete(courseCode)
    } else {
      newSelected.add(courseCode)
    }
    setSelectedCourses(newSelected)
  }

  const filteredCourses = courses.filter(
    (course) => course.department === selectedDepartment
  )

  const noOfUnits = Array.from(selectedCourses).reduce((total, courseCode) => {
    const course = courses.find((c) => c.code === courseCode)
    return total + (course?.units || 0)
  }, 0)

  const noOfCoursesSelected = selectedCourses.size

  return (
    <Tabs defaultValue="isEligible" className="h-auto w-full">
      <TabsList>
        <TabsTrigger value="isEligible">Selected Courses</TabsTrigger>
        <TabsTrigger value="downloadForm">Download Course Form</TabsTrigger>
      </TabsList>
      <TabsContent value="isEligible">
        <Card className="w-full">
          <CardHeader></CardHeader>
          <CardContent>
            <Alert
              className={`flex ${
                registrationEligible
                  ? "alert:border-emerald-200 alert:bg-emerald-50"
                  : "alert:border-amber-200 alert:bg-amber-50"
              }`}
            >
              <AlertDescription
                className={`flex items-center gap-2 ${
                  registrationEligible
                    ? "alert-description:text-emerald-600"
                    : "alert-description:text-amber-700"
                }`}
              >
                {registrationEligible && <BadgeCheck />}
                <span>
                  {registrationEligible === undefined
                    ? "Registration eligibility is not available in Firebase."
                    : registrationEligible
                      ? `Eligibility confirmed. Select up to ${maxUnits} units.`
                      : "Course registration is not currently available for this account."}
                </span>
              </AlertDescription>
            </Alert>

            <div className="mt-4 w-full max-w-sm">
              <Select
                value={selectedDepartment}
                onValueChange={(value) => {
                  setSelectedDepartment(value)
                  setSelectedCourses(new Set())
                }}
              >
                <SelectTrigger className="w-full max-w-64">
                  <SelectValue placeholder="Select Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Departments</SelectLabel>
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
              Selected: {noOfUnits} / {maxUnits} units. {noOfCoursesSelected}{" "}
              courses selected.
            </div>
          </CardContent>
          <CardFooter className="flex h-auto w-full flex-col gap-4">
            <div className="grid w-full grid-cols-2 gap-2">
              {filteredCourses.length === 0 && (
                <p className="col-span-2 text-sm text-muted-foreground">
                  No courses are available in Firebase.
                </p>
              )}
              {filteredCourses.map((course) => (
                <Button
                  key={course.code}
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
                    <p className="text-xs text-emerald-700">
                      Prerequisites: {course.prerequisites.join(", ")}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
            <div className="mt-auto flex w-full items-center justify-between gap-2">
              <Button variant="outline" className="w-1/2">
                <ArrowLeft className="size-4" /> Back
              </Button>
              <Button className="w-1/2" disabled>
                Continue to Review <Check className="size-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="downloadForm">
        <div className="flex h-64 w-full flex-col items-center justify-center rounded-md border bg-secondary">
          <p className="gap-2 text-sm text-muted-foreground">
            Do you want to download the course registration form for the
            selected courses?
            <br /> This form will be used for final submission and approval by
            the department.{" "}
          </p>
          <Button variant="outline" className="mt-4 gap-2" disabled>
            Download Form
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}

export default CourseCatalog
