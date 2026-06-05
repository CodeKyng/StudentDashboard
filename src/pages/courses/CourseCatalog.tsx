import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
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

const maxUnits = 18

export interface Course {
  code: string
  department: string
  name: string
  description: string
  prerequisites: string[]
  units: number
  semester: string
}

interface CourseCatalogProps {
  courses: Course[]
}

function CourseCatalog({ courses }: CourseCatalogProps) {
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set())
  const [selectedDepartment, setSelectedDepartment] =
    useState<string>("electrical")

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
          <CardHeader>
          </CardHeader>
          <CardContent>
            <Alert className="flex alert:border-emerald-200 alert:bg-emerald-50">
              <AlertDescription className="flex items-center gap-2 alert-description:text-emerald-600">
                <BadgeCheck />
                <span>
                  Eligibility confirmed. Fees cleared for last semester. Select
                  up to {maxUnits} units.
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
                    <SelectLabel>Engineering Departments</SelectLabel>
                    <SelectItem value="electrical">
                      Electrical Engineering
                    </SelectItem>
                    <SelectItem value="civil">Civil Engineering</SelectItem>
                    <SelectItem value="mechanical">
                      Mechanical Engineering
                    </SelectItem>
                    <SelectItem value="mining">Mining Engineering</SelectItem>
                    <SelectItem value="computer">
                      Computer Engineering
                    </SelectItem>
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
              {filteredCourses.map((course) => (
                <Button
                  key={course.code}
                  onClick={() => handleCourseClick(course.code)}
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
              <Button className="w-1/2">
                Continue to Review <Check className="size-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="downloadForm">
        <div className="flex flex-col h-64 w-full items-center justify-center rounded-md border bg-secondary">
          <p className="text-sm text-muted-foreground gap-2">
            Do you want to download the course registration form for the selected courses?<br /> This form will be used for final submission and approval by the department.{" "}
          </p>
          <Button variant="outline" className="gap-2 mt-4">
              Download Form
            </Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}

export default CourseCatalog
